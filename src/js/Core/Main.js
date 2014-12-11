//using
window.ApplicationCore = window.ApplicationCore || {};
window.UI = window.UI || {};
window.LastFm = window.LastFm || {};

//main
main = function()
{
    var pageLoader = new window.ApplicationCore.PageLoader();
    HideAllApplicationPages();

    var coreServicesFactory = new window.ApplicationCore.CoreServicesFactory();
    pageLoader.preInitialise(coreServicesFactory);

    Logger.getInstance().info(window.Common.ApplicationDetails.Name+" version: "+window.Common.ApplicationDetails.Version);
    Logger.getInstance().info("Application initialisation started.");

    var globalErrorHandler = new window.Common.GlobalErrorHandler();
    globalErrorHandler.initialise();

    var uiFactory = new window.UI.UIControllersFactory(window.UI.UIControllersFactoryConfig);
    var playerServicesFactory = new window.Player.PlayerServicesFactory();
    var lastFmServicesFactory = new window.LastFm.LastFmApiFactory();

    pageLoader.initialiseServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);
    pageLoader.initialiseUI(uiFactory, lastFmServicesFactory);

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

    Logger.getInstance().info("Application initialisation ended.");
};

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