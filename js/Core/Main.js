//using
window.ApplicationCore = window.ApplicationCore || {};

//main
$(function()
{
    var coreServicesFactory = new window.ApplicationCore.CoreServicesFactory();

    //logger should be created at the begining
    var logger = coreServicesFactory.createLoggerService();
    window.Common.Log.SetInsance(logger);
    window.Common.Log.Instance().Info("Application initialisation started.");

    //creating event broker service
    this._eventBroker = coreServicesFactory.createBrokerHandler();
    window.Common.EventBrokerSingleton.setInstance(this._eventBroker);

    //creating application core
    var applicationCore = new window.ApplicationCore.AppCore(coreServicesFactory);
    applicationCore.initialise();

    HandleSession();
    var token = GetToken();
    applicationCore.createNewSession(token);
    HookUpLoadUrlButtonAction(applicationCore);

    HookUpToolbarButtons();

   // HookUpLoadUrlButtonAction(applicationCore.getPlayer());
   // HookUpToolbarButtons(applicationCore.getPlayer());
   // HeaderAction();

    window.Common.Log.Instance().Info("Application initialisation ended.");
});

function HandleSession()
{
    window.Common.EventBrokerSingleton.instance().addListener(window.LastFm.Events.SessionEstablished,
        function(userName)
        {
            $("#authentication").hide();
            $("#current").html("Hello! <a href=\"http:\/\/www.lastfm.pl\/user\">"+userName+"<\/a>").show();
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

function VideoLoaded(video)
{
    $("#player .title").text("Video: "+video.title);
    $("title").text(video.title);
}

function HeaderAction(){
    $(".page-title").bind("click", function()
    {
        var item = $(this).parent();
        var content = item.find(".content");
        if(content.css("display") === "none")
        {
            content.fadeIn();
            item.animate(
                {
                    height: "100%"
                });
        }
        else
        {
            content.fadeOut();
            item.animate(
                {
                    height: "50px"
                });
        }
    });
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
        eventBroker.fireEvent(window.UI.Events.playPreviousRequested);
    });

    $("#next_button").bind("click", function()
    {
        eventBroker.fireEvent(window.UI.Events.playNextRequested);
    });

}

function HookUpLoadUrlButtonAction(player){
    $("#loadUrlButton").bind("click", function()
    {
        var url= $("#videoUrl").val();

        //player.loadPlaylistFromUrl(url);
         player.play(url);
    });
}
