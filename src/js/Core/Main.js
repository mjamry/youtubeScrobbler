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
    var applicationCore = new window.ApplicationCore.AppCore(coreServicesFactory, uiFactory, playerServicesFactory);
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
    hookUpToGoogleAuthButton(applicationCore);
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

function hookUpToGoogleAuthButton(app)
{
    var button = $("#accounts-google-auth-button");
    var fun = function()
    {
        return function()
        {

            var userPlaylistDetailsHandler = function(details)
            {
                for(var i in details.items)
                {
                    Logger.getInstance().debug("id: "+details.items[i].id+" title: "+details.items[i].snippet.title+" decr: "+details.items[i].snippet.description);

                }

            };

            var userDetailsHandler = function(details)
            {
                var accountDetails =
                {
                    accountName: "Google",
                    userName: details.given_name,
                    pictureUrl: details.picture,
                    otherDetails: [{link: details.link}]
                };

                EventBroker.getInstance().fireEventWithData(window.LastFm.Events.SessionEstablished, accountDetails);
                Logger.getInstance().debug("usr id: "+details.id+' name: '+details.given_name+' pic: '+details.picture);
            };

            var goog = new window.Google.GoogleApiWrapper();
            var g = new window.Google.GoogleApiWithSessionControl(goog, new window.Accounts.GoogleSessionCoordinator(goog));
            var g2 = app.sessionService;
            g2.establishSession(window.Accounts.AccountsNames.LastFM);
            //g2.refreshSession(window.Accounts.AccountsNames.LastFM);
            Logger.getInstance().debug("[MAIN] 1");
           //g.getUserInfo(userDetailsHandler);
           // g.getUserPlaylists(userPlaylistDetailsHandler);
            Logger.getInstance().debug("[MAIN] 2");
        };
    };

    button.click(fun());
}