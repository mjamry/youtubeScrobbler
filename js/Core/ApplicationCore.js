var onlineScrobbler;

$(function()
{
    onlineScrobbler = new window.ApplicationCore.OnlineScrobbler();
    onlineScrobbler.initialisePlayer();

    //_lastFmFactory = new window.LastFm.LastFmApiFactory();

    // InitialisePlayer();
    //InitialiseScrobbler();
    HookUpLoadUrlButtonAction();
    HookUpToolbarButtons();
    HeaderAction();
    var urlPars = new window.Common.UrlParser();
    _token = urlPars.getParameterValue(window.location.href, "token");
    window.Common.Log.Instance().Debug("Token: "+_token+" has been obtained.");


    onlineScrobbler.createSession(_token);
});

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
    onlineScrobbler._player.hookUpButtonAction("play_button", "playVideo");
    onlineScrobbler._player.hookUpButtonAction("pause_button", "pauseVideo");
    onlineScrobbler._player.hookUpButtonAction("next_button", "nextVideo");
    onlineScrobbler._player.hookUpButtonAction("prev_button", "prevVideo");
}



function HookUpLoadUrlButtonAction(){
    $("#loadUrlButton").bind("click", function()
    {
        var url= $("#videoUrl").val();

        onlineScrobbler._player.loadPlaylistFromUrl(url);
    });
}