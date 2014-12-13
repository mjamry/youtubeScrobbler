window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.PageLoader  =function()
{
    this.appCore = new window.ApplicationCore.AppCore();
    this.canLoadGoogleServices = false;
};

window.ApplicationCore.PageLoader.prototype =
{
    load: function(coreServicesFactory, lastFmServicesFactory, playerServicesFactory, uiFactory, pagesConfiguration)
    {
        var that = this;
        this.preInitialise(coreServicesFactory).
            then(function preInitSuccess()
            {
                return that.loadSubpages(uiFactory, pagesConfiguration);
            }).
            then(function loadPagesContentSuccess()
            {
                return that.createServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);
            }).
            then(function createServicesSuccess()
            {
                return that.createUI(uiFactory, lastFmServicesFactory);
            }).
            then(function createUISuccess()
            {
                return that.initialiseUI();
            }).
            then(function initialiseUISuccess()
            {
                return that.initialiseServices();
            }).
            then(function initialiseServicesSuccess()
            {
                return that.postInitialise(uiFactory);
            }).
            then(function postInitialiseSuccess()
            {
                //check if google client has been already loaded
                //if yes init google services, else just wait until it is ready
                if(that.canLoadGoogleServices)
                {
                    that.initialiseGoogleServices();
                }
                else
                {
                    that.canLoadGoogleServices = true;
                }

                Logger.getInstance().info("[Init] Page initialisation successful");
            });
    },

    preInitialise: function(coreServicesFactory)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            //logger should be created at the beginning
            new Logger();
            var logger = coreServicesFactory.createLoggerService();
            Logger.setInstance(logger);

            Logger.getInstance().info(window.Common.ApplicationDetails.Name+" version: "+window.Common.ApplicationDetails.Version);
            Logger.getInstance().info("[Init] Pre initialise - loading static services");

            //creating event broker service
            new EventBroker();
            that._eventBroker = coreServicesFactory.createBrokerHandler();
            EventBroker.setInstance(that._eventBroker);

            //create user notifier service
            new UserNotifier();
            var userNotifier = coreServicesFactory.createUserNotifier();
            UserNotifier.setInstance(userNotifier);

            logger.initialise(that._eventBroker);

            //create time parser
            new TimeParser();
            TimeParser.setInstance(new window.Common.TimeParserImpl());

            //create local storage parser
            new LocalStorage();
            LocalStorage.setInstance(new window.Common.LocalStorageImpl());

            //create cookies service
            new Cookie();
            Cookie.setInstance(coreServicesFactory.createCookieHandler());

            //creates progressbar service
            new ProgressbarService();
            ProgressbarService.setInstance(new window.Services.ProgressbarServiceImpl());

            resolve();
        });
    },

    createServices: function(coreServicesFactory, lastFmServicesFactory, playerServicesFactory)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Creating app services");
            that.appCore.createAppServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);

            resolve();
        });
    },

    initialiseServices: function()
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Initialising app services");
            that.appCore.initialiseAppServices();

            resolve();
        });
    },

    createUI: function(uiFactory, lastFmServicesFactory)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Creating UI view controllers");
            that.appCore.createViewControllers(uiFactory, lastFmServicesFactory);

            resolve();
        });
    },

    initialiseUI: function()
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Initialising UI view controllers");
            that.appCore.initialiseViewControllers();

            resolve();
        });
    },

    loadSubpages: function(uiFactory, pagesConfiguration)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Loading app pages");
            that.menuController = uiFactory.createMenuViewController();
            that.menuController.initialise();

            var pageLoadedHandler = function onPageLoaded(pageConfig)
            {
                return function onPageLoaded(response, status)
                {
                    Logger.getInstance().debug("file: "+pageConfig.ContentLocation+" stat: "+status);
                };
            };

            for(var item in pagesConfiguration)
            {
                that.menuController.add(pagesConfiguration[item].Name, pagesConfiguration[item].Icon, pagesConfiguration[item].Page);
                $(pagesConfiguration[item].Page).load(pagesConfiguration[item].ContentLocation, pageLoadedHandler(pagesConfiguration[item]));
            }

            resolve();
        });
    },

    initialiseGoogleServices: function()
    {
        //check if google services can be initialised
        //if yes - do it
        //else - just set flag that allows to load services after initialisation
        if(!this.canLoadGoogleServices)
        {
            Logger.getInstance().info("[Init] Google client ready");
            this.canLoadGoogleServices = true;
        }
        else
        {
            Logger.getInstance().info("[Init] Initialise google services");
            this.appCore.initialiseGoogleApiServices();
        }
    },

    postInitialise: function(uiFactory)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Post initialise");
            //this is here only for testing purposes to show logs
            var uilogger = uiFactory.createLoggerViewController();
            uilogger.initialise();
            uilogger.isLoggingAllowed = true;

            //creating google tracker
            var tracker = new window.Tracking.GoogleEventTrackerImpl(window.Tracking.GoogleTrackerConfig);
            new GoogleTracker();
            GoogleTracker.setInstance(tracker);

            //hook to ui events
            var uiTracker = new window.Tracking.GoogleUiTracker(window.Tracking.GoogleTrackerConfig);
            uiTracker.hookUpToPlaybackControlEvents(window.UI.PlaybackControlConfiguration);
            uiTracker.hookUpToPlaylistControlEvents(window.UI.PlaylistControlConfiguration);
            uiTracker.hookUpToTestControlEvents(window.UI.TestReportUIConfig);
            uiTracker.hookUpToLoggerControlEvents(window.UI.LoggerUIConfig);
            uiTracker.hookUpToMediaLoadEvents(window.UI.MediaLoadConfig);
            uiTracker.hookUpToPlaylistItemEvents(window.UI.PlaylistUIConfig);

            var testReport = uiFactory.createTestReportViewController();
            testReport.initialise();

            that.HideAllApplicationPages();

            resolve();
        });

    },

    //TODO: find more appropriate place for this
    HideAllApplicationPages: function()
    {
        var menuConfig = window.UI.MenuItemsConfig;
        for(var i in menuConfig)
        {
            $(menuConfig[i].Page).addClass("application-page-hidden");
        }
    }
};



