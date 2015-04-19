window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.PageLoader  =function()
{
    this.appCore = new window.ApplicationCore.AppCore();
    this.canLoadGoogleServices = false;
};

window.ApplicationCore.PageLoader.prototype =
{
    load: function(coreServicesFactory, lastFmServicesFactory, playerServicesFactory, uiFactory, pagesConfiguration, menuItemsConfiguration)
    {
        var startTime = new Date().getTime();
        var that = this;
        var loadingIndicatorDetails =
        {
            title: "Please wait, loading...",
            description: "",
            fullscreen: true
        };

        this._preInitialise(coreServicesFactory, uiFactory)
            .then(function preInitSuccess()
            {
                return that._loadPage(window.Common.ControlsSource);
            })
            .then(function controlsTemplateLoadingSuccess()
            {
                LoadingIndicatorService.getInstance().show(loadingIndicatorDetails);
                loadingIndicatorDetails.description = "Loading page content";
                LoadingIndicatorService.getInstance().show(loadingIndicatorDetails);
                return that._loadPagesContent(pagesConfiguration);
            })
            .then(function loadPagesContentSuccess()
            {
                loadingIndicatorDetails.description = "Creating page services";
                LoadingIndicatorService.getInstance().show(loadingIndicatorDetails);
                return that._createServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);
            })
            .then(function createServicesSuccess()
            {
                loadingIndicatorDetails.description = "Creating UI";
                LoadingIndicatorService.getInstance().show(loadingIndicatorDetails);
                return that._createUI(uiFactory, lastFmServicesFactory);
            })
            .then(function createUISuccess()
            {
                return that._initialiseUI(menuItemsConfiguration);
            })
            .then(function initialiseUISuccess()
            {
                return that._initialiseServices();
            })
            .then(function initialiseServicesSuccess()
            {
                loadingIndicatorDetails.description = "Almost everything loaded";
                LoadingIndicatorService.getInstance().show(loadingIndicatorDetails);
                return that._postInitialise(uiFactory);
            })
            .then(function postInitialiseSuccess()
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

                var endTime = new Date().getTime();
                Logger.getInstance().info("[Init] Page initialisation successful.");
                Logger.getInstance().debug("[Init] Initialisation took "+(endTime - startTime)+"ms");

                LoadingIndicatorService.getInstance().hide();
                $("#page").show();
            })
            .catch(function(error)
            {
                loadingIndicatorDetails.title = "Error occurs while loading page.";
                loadingIndicatorDetails.description = error;
                LoadingIndicatorService.getInstance().show(loadingIndicatorDetails);
                Logger.getInstance().error("[Init] Page initialisation error: "+error);
            });
    },

    _preInitialise: function(coreServicesFactory, uiFactory)
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

            //handles global errors
            var globalErrorHandler = new window.Common.GlobalErrorHandler();
            globalErrorHandler.initialise();

            //this is here only for testing purposes to show logs
            var uilogger = uiFactory.createLoggerViewController();
            uilogger.initialise();
            uilogger.isLoggingAllowed = true;

            //creates report sender service (sends an email in case of error)
            new ReportSender();
            var reportSender = coreServicesFactory.createReportSender();
            reportSender.initialise();
            ReportSender.setInstance(reportSender);

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

            new DesktopNotification();
            DesktopNotification.setInstance(new window.Common.DesktopNotificationImpl());

            //create loading indicator service
            new LoadingIndicatorService();
            LoadingIndicatorService.setInstance(new window.Services.LoadingIndicatorServiceImpl(window.UI.LoadingIndicatorConfiguration));

            new ModalService();
            ModalService.setInstance(new window.Services.ModalServiceImpl(uiFactory.createModalViewController()));

            that._getApiKeys();

            resolve();
        });
    },

    _getApiKeys: function()
    {
        var lastFmApi = new window.LastFm.LastFmConstants();
        lastFmApi.obtainKeys();

        var googleApi = new window.Google.ApiKeys();
        googleApi.obtainKeys();
    },

    _createServices: function(coreServicesFactory, lastFmServicesFactory, playerServicesFactory)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Creating app services");
            that.appCore.createAppServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);

            resolve();
        });
    },

    _initialiseServices: function()
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Initialising app services");
            that.appCore.initialiseAppServices();

            resolve();
        });
    },

    _createUI: function(uiFactory, lastFmServicesFactory)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Creating UI view controllers");
            that.appCore.createViewControllers(uiFactory, lastFmServicesFactory);

            resolve();
        });
    },

    _initialiseUI: function(menuItemsConfiguration)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Initialising UI view controllers");
            that.appCore.initialiseViewControllers(menuItemsConfiguration);

            resolve();
        });
    },

    _loadPagesContent: function(pagesConfiguration)
    {
        Logger.getInstance().info("[Init] Loading app pages");

        var pageLoadingPromises = [];

        for(var item in pagesConfiguration)
        {
            pageLoadingPromises.push(this._loadPage(pagesConfiguration[item]));
        }

        //load all pages (simultaneously) and move on
        return Promise.all(pageLoadingPromises);
    },

    _loadPage: function(page)
    {
        var pageLoadedHandler = function onPageLoaded(resolve, reject)
        {
            return function onPageLoaded(response, status, xhr)
            {
                if(status === "success")
                {
                    Logger.getInstance().debug("[Init] File "+page.ContentLocation+" loaded");
                    resolve();
                }
                else
                {
                    reject(page.ContentLocation+"<br>"+xhr.statusText+" ("+xhr.status+")");
                }
            };
        };

        return new Promise(function(resolve, reject)
        {
            $(page.Container).load(page.ContentLocation, pageLoadedHandler(resolve, reject));
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

    _postInitialise: function(uiFactory)
    {
        var that = this;
        return new Promise(function(resolve)
        {
            Logger.getInstance().info("[Init] Post initialise");

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

        //show player after initialisation
        $(menuConfig.Player.Page).removeClass("application-page-hidden");
    }
};



