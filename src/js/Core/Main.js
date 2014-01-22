//using
window.ApplicationCore = window.ApplicationCore || {};
window.UI = window.UI || {};
window.LastFm = window.LastFm || {};

//main
$(function()
{
    //hides controls
    $("#controls-schemes").hide();

    var coreServicesFactory = new window.ApplicationCore.CoreServicesFactory();
    var uiFactory = new window.UI.UIControllersFactory();
    var playerServicesFactory = new window.Player.PlayerServicesFactory();

    //logger should be created at the beginning
    var logger = coreServicesFactory.createLoggerService();
    Logger.setInstance(logger);

    //creating event broker service
    this._eventBroker = coreServicesFactory.createBrokerHandler();
    EventBroker.setInstance(this._eventBroker);

    logger.initialise(this._eventBroker);

    var uilogger = uiFactory.createLoggerViewController();
    uilogger.initialise();
    uilogger.isLoggingAllowed = true;

    Logger.getInstance().Info("Application initialisation started.");
    TimeParser.setInstance(new window.Common.TimeParserImpl());

    Cookie.setInstance(coreServicesFactory.createCookieHandler());

    //creating application core
    var applicationCore = new window.ApplicationCore.AppCore(coreServicesFactory, uiFactory, playerServicesFactory);
    applicationCore.initialise();

    //creating google tracker
    var tracker = new window.Tracking.GoogleEventTrackerImpl(window.Tracking.GoogleTrackerConfig);
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

    Logger.getInstance().Info("Application initialisation ended.");
});
