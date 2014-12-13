window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.PageLoader  =function()
{
    this.appCore = new window.ApplicationCore.AppCore();
};

window.ApplicationCore.PageLoader.prototype =
{
    preInitialise: function(coreServicesFactory)
    {
        //logger should be created at the beginning
        new Logger();
        var logger = coreServicesFactory.createLoggerService();
        Logger.setInstance(logger);

        Logger.getInstance().info(window.Common.ApplicationDetails.Name+" version: "+window.Common.ApplicationDetails.Version);
        Logger.getInstance().info("[Init] Pre initialise - loading static services");

        //creating event broker service
        new EventBroker();
        this._eventBroker = coreServicesFactory.createBrokerHandler();
        EventBroker.setInstance(this._eventBroker);

        //create user notifier service
        new UserNotifier();
        var userNotifier = coreServicesFactory.createUserNotifier();
        UserNotifier.setInstance(userNotifier);

        logger.initialise(this._eventBroker);

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
    },

    initialiseServices: function(coreServicesFactory, lastFmServicesFactory, playerServicesFactory)
    {
        Logger.getInstance().info("[Init] Creating app services");
        this.appCore.createAppServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);
        Logger.getInstance().info("[Init] Initialising app services");
        this.appCore.initialiseAppServices();
    },

    initialiseUI: function(uiFactory, lastFmServicesFactory)
    {
        Logger.getInstance().info("[Init] Creating UI view controllers");
        this.appCore.createViewControllers(uiFactory, lastFmServicesFactory);
        Logger.getInstance().info("[Init] Initialising UI view controllers");
        this.appCore.initialiseViewControllers();
    },

    loadSubpages: function(uiFactory, pagesConfiguration)
    {
        Logger.getInstance().info("[Init] Loading app pages");
        this.menuController = uiFactory.createMenuViewController();
        this.menuController.initialise();

        var pageLoadedHandler = function onPageLoaded(pageConfig)
        {
            return function onPageLoaded(response, status)
            {
                Logger.getInstance().debug("file: "+pageConfig.ContentLocation+" stat: "+status);
            };
        };

        for(var item in pagesConfiguration)
        {
            this.menuController.add(pagesConfiguration[item].Name, pagesConfiguration[item].Icon, pagesConfiguration[item].Page);
            $(pagesConfiguration[item].Page).load(pagesConfiguration[item].ContentLocation, pageLoadedHandler(pagesConfiguration[item]));
        }
    },

    initialiseGoogleServices: function()
    {
        this.appCore.initialiseGoogleApiServices();
    },

    postInitialise: function(uiFactory)
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

        this.HideAllApplicationPages();
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



