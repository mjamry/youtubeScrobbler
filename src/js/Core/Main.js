//using
window.ApplicationCore = window.ApplicationCore || {};
window.UI = window.UI || {};
window.LastFm = window.LastFm || {};

//main
$(function()
{
    //hised controls
    $("#controls-schemes").hide();

    var coreServicesFactory = new window.ApplicationCore.CoreServicesFactory();
    var uiFactory = new window.UI.UIControllersFactory();
    var playerServicesFactory = new window.Player.PlayerServicesFactory();

    //logger should be created at the begining
    var logger = coreServicesFactory.createLoggerService();
    Logger.setInstance(logger);
    Logger.getInstance().Info("Application initialisation started.");
    TimeParser.setInstance(new window.Common.TimeParserImpl());

    //creating event broker service
    this._eventBroker = coreServicesFactory.createBrokerHandler();
    EventBroker.setInstance(this._eventBroker);

    logger.initialise(this._eventBroker);

    var uilogger = uiFactory.createLoggerViewController();
    uilogger.initialise();
    uilogger.isLoggingAllowed = true;

    //creating application core
    var applicationCore = new window.ApplicationCore.AppCore(coreServicesFactory, uiFactory, playerServicesFactory);
    applicationCore.initialise();

    HandleSession();
    var token = GetToken();
    applicationCore.createNewSession(token);
    HookUpLoadUrlButtonAction(applicationCore);

    HookUpToolbarButtons();

    var testReport = uiFactory.createTestReportViewController();
    testReport.initialise();

   // HookUpLoadUrlButtonAction(applicationCore.getPlayer());
   // HookUpToolbarButtons(applicationCore.getPlayer());
   // HeaderAction();

    Logger.getInstance().Info("Application initialisation ended.");
});


function HandleSession()
{
    $("#authentication-current-session").hide();
    $("#authentication-link").bind("click", function()
    {
        window.location = "http://www.last.fm/api/auth/?api_key="+window.LastFm.LastFmConstants.API_KEY+"&cb="+document.URL;
    });

    EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablished,
        function(userName)
        {
            $("#authentication").hide();
            $("#authentication-current-session").html('Hello! <a target="blank" href="http://www.lastfm.pl/user/'+userName+'">'+userName+'<\/a>').show();
        }
    )
}

function GetToken()
{
    var urlPars = new window.Common.UrlParser();
    var _token = urlPars.getParameterValue(window.location.href, "token");
    Logger.getInstance().Debug("Token: "+_token+" has been obtained.");

    return _token;
}

function HookUpToolbarButtons()
{
   /* player.hookUpButtonAction("play_button", "playVideo");
    player.hookUpButtonAction("pause_button", "pauseVideo");
    player.hookUpButtonAction("next_button", "nextVideo");
    player.hookUpButtonAction("prev_button", "prevVideo");*/

    var eventBroker = EventBroker.getInstance();

    $("#prev_button").bind("click", function()
    {
        eventBroker.fireEvent(window.UI.Events.PlayPreviousRequested);
    });

    $("#next_button").bind("click", function()
    {
        eventBroker.fireEvent(window.UI.Events.PlayNextRequested);
    });

}
//TODO move to ViewController
function HookUpLoadUrlButtonAction(player){
    $("#create-new-playlist").bind("click", function()
    {
        var mediaLocation= $("#media-location").val();
        player.createNewPlaylist(mediaLocation);
    });

    $("#add-to-playlist").bind("click", function()
    {
        var mediaLocation = $("#media-location").val();
        player.addToPlaylist(mediaLocation);
    });
}
