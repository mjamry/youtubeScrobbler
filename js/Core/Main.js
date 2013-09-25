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

    var applicationCore = new window.ApplicationCore.AppCore(coreServicesFactory);
    applicationCore.initialise();

    var token = GetToken();
    applicationCore.createNewSession(token);

    HookUpLoadUrlButtonAction(applicationCore.getPlayer());
    HookUpToolbarButtons(applicationCore.getPlayer());
    HeaderAction();

    window.Common.Log.Instance().Info("Application initialisation ended.");
});

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

function HookUpToolbarButtons(player)
{
    player.hookUpButtonAction("play_button", "playVideo");
    player.hookUpButtonAction("pause_button", "pauseVideo");
    player.hookUpButtonAction("next_button", "nextVideo");
    player.hookUpButtonAction("prev_button", "prevVideo");
}



function HookUpLoadUrlButtonAction(player){
    $("#loadUrlButton").bind("click", function()
    {
        var url= $("#videoUrl").val();

        player.loadPlaylistFromUrl(url);
    });
}
