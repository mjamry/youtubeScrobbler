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
        this.appCore.createAppServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);

        this.appCore.initialiseAppServices();
    },

    initialiseUI: function(uiFactory, lastFmServicesFactory)
    {
        this.appCore.createViewControllers(uiFactory, lastFmServicesFactory);

        this.appCore.initialiseViewControllers();
    },

    loadSubpages: function()
    {

    },

    createApplicationCore: function()
    {
        return new window.ApplicationCore.AppCore();
    }
};



