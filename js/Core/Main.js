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

    //logger should be created at the begining
    var logger = coreServicesFactory.createLoggerService();
    window.Common.Log.SetInsance(logger);
    window.Common.Log.Instance().Info("Application initialisation started.");
    TimeParser.setInstance(new window.Common.TimeParserImpl());

    //creating event broker service
    this._eventBroker = coreServicesFactory.createBrokerHandler();
    window.Common.EventBrokerSingleton.setInstance(this._eventBroker);

    logger.initialise(this._eventBroker);

    var uilogger = uiFactory.createLoggerViewController();
    uilogger.initialise();
    uilogger.isLoggingAllowed = true;

    //creating application core
    var applicationCore = new window.ApplicationCore.AppCore(coreServicesFactory, uiFactory);
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

    window.Common.Log.Instance().Info("Application initialisation ended.");
});


function HandleSession()
{
    $("#authentication-link").bind("click", function()
    {
        window.location = "http://www.last.fm/api/auth/?api_key="+window.LastFm.LastFmConstants.API_KEY+"&cb="+document.URL;
    });

    window.Common.EventBrokerSingleton.instance().addListener(window.LastFm.Events.SessionEstablished,
        function(userName)
        {
            $("#authentication").hide();
            $("#current").html('Hello! <a target="blank" href="http://www.lastfm.pl/user/'+userName+'">'+userName+'<\/a>').show();
        }
    )
}

function GetToken()
{
    var urlPars = new window.Common.UrlParser();
    var _token = urlPars.getParameterValue(window.location.href, "token");
    window.Common.Log.Instance().Debug("Token: "+_token+" has been obtained.");

    return _token;
}

function HookUpToolbarButtons()
{
   /* player.hookUpButtonAction("play_button", "playVideo");
    player.hookUpButtonAction("pause_button", "pauseVideo");
    player.hookUpButtonAction("next_button", "nextVideo");
    player.hookUpButtonAction("prev_button", "prevVideo");*/

    var eventBroker = window.Common.EventBrokerSingleton.instance();

    $("#prev_button").bind("click", function()
    {
        eventBroker.fireEvent(window.UI.Events.PlayPreviousRequested);
    });

    $("#next_button").bind("click", function()
    {
        eventBroker.fireEvent(window.UI.Events.PlayNextRequested);
    });

}

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
