//using
window.ApplicationCore = window.ApplicationCore || {};
window.UI = window.UI || {};
window.LastFm = window.LastFm || {};

//main
$(function()
{
    //hides controls
    $("#controls-schemes").hide();
    HideAllApplicationPages();

    var coreServicesFactory = new window.ApplicationCore.CoreServicesFactory();
    var uiFactory = new window.UI.UIControllersFactory(window.UI.UIControllersFactoryConfig);
    var playerServicesFactory = new window.Player.PlayerServicesFactory();
    var lastFmServicesFactory = new window.LastFm.LastFmApiFactory();

    var globalErrorHandler = new window.Common.GlobalErrorHandler();
    globalErrorHandler.initialise();

    //logger should be created at the beginning
    new Logger();
    var logger = coreServicesFactory.createLoggerService();
    Logger.setInstance(logger);

    //creating event broker service
    new EventBroker();
    this._eventBroker = coreServicesFactory.createBrokerHandler();
    EventBroker.setInstance(this._eventBroker);

    logger.initialise(this._eventBroker);

    var uilogger = uiFactory.createLoggerViewController();
    uilogger.initialise();
    uilogger.isLoggingAllowed = true;

    new UserNotifier();
    var userNotifier = coreServicesFactory.createUserNotifier();
    UserNotifier.setInstance(userNotifier);

    Logger.getInstance().info(window.Common.ApplicationDetails.Name+" version: "+window.Common.ApplicationDetails.Version);
    Logger.getInstance().info("Application initialisation started.");
    new TimeParser();
    TimeParser.setInstance(new window.Common.TimeParserImpl());

    new LocalStorage();
    LocalStorage.setInstance(new window.Common.LocalStorageImpl());

    new Cookie();
    Cookie.setInstance(coreServicesFactory.createCookieHandler());

    new ProgressbarService();
    ProgressbarService.setInstance(new window.Services.ProgressbarServiceImpl());

    //creating application core
    var applicationCore = new window.ApplicationCore.AppCore(coreServicesFactory, uiFactory, playerServicesFactory, lastFmServicesFactory);
    applicationCore.initialise();
    applicationCore.setUpMenuItems(window.UI.MenuItemsConfig);

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

    Logger.getInstance().info("Application initialisation ended.");
});

$(window).unload(function()
{
    EventBroker.getInstance().fireEvent(window.Common.ApplicationEvents.ApplicationClosed);
});

//TODO: find more appropriate place for this
function HideAllApplicationPages()
{
    var menuConfig = window.UI.MenuItemsConfig;
    for(var i in menuConfig)
    {
        $(menuConfig[i].Page).addClass("application-page-hidden");
    }
}