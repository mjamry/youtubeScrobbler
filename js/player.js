$(function()
{
    InitialisePlayer(); 
    HookUpLoadUrlButtonAction();
    HookUpToolbarButtons();
    HeaderAction();
});

var Player;
var _viewUpdater;
function InitialisePlayer()
{
    var config = {
        highDef: 1,
        width:700,
        height:400,
        chromeless: 0,
        showTime: 1,
        showToolbar: false,
        autoPlay: 1,
        repeatPlaylist: 1,
        playlistAppendTo: $("#playlist .content"),
        timeAppendTo: $("#player .time"),
        playlist: 
            {
                title: 'Random videos',
                videos: [
                    { id: 'wDowSzVgjXI', title: 'The All Seeing I - Beat Goes On HQ' },
                    { id: 'hPzNl6NKAG0', title: 'Maru the cat' },
                    { id: 'lvpuT3aoypE', title: 'All Online Data Lost After Internet Crash' },
                    { id: 'Kv6Ewqx3PMs', title: 'Mr. Oizo Flat Beat' },
                    { id: 'IAxj2ob_JoU', title: 'Most incredible volcano footage ever' },
                    { id: '3ycBGkLkEkg', title: 'Wingsuit BASE jumping in Baffin Island' }
                    ]
            }
    };
    
    Player = new ytPlayer(config, $(".youtube-player"));
    Player.addListener(Player.events.videoLoaded, VideoLoaded);

    Player.addListener(Player.events.playlistReady, function(){
        console.log("playlist ready");
    });
    Player.addListener(Player.events.error, function(){
        console.log("error");
    });
    Player.addListener(Player.events.playerReady, function(){
        console.log("plReady");
    });
    Player.addListener(Player.events.playlistReady, function(){
        console.log("playlistReady");
    });
    Player.addListener(Player.events.videoBuffering, function(){
        console.log("buffering");
    });
    Player.addListener(Player.events.videoCue, function(){
        console.log("videoCue");
    });
    Player.addListener(Player.events.videoLoaded, function(){
        console.log("vid loaded");
    });
    Player.addListener(Player.events.videoPaused, function(){
        console.log("vid paused");
    });
    Player.addListener(Player.events.videoPlay, function(){
        console.log("vid play");
    });
    Player.addListener(Player.events.beforePlaylistReady, function(){
        console.log("before playlist ready");
    });
    
    
    
    
    
    
    
    
    _viewUpdater = new viewUpdater();
    Player.addListener(Player.events.videoPlay, function(video)
    {
        var text = "Playing: "+video.title;
        _viewUpdater.updateVideoTitle(text);
    });
}

function VideoLoaded(video)
{
    console.log("id: "+video.id+" title: "+video.title);
    $("#player .title").text("Video: "+video.title);
    $("title").text(video.title);
}

function HeaderAction(){
    $(".header").bind("click", function()
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
    Player.hookUpButtonAction("play_button", "playVideo");
    Player.hookUpButtonAction("pause_button", "pauseVideo");
    Player.hookUpButtonAction("next_button", "nextVideo");
    Player.hookUpButtonAction("prev_button", "prevVideo");
}



function HookUpLoadUrlButtonAction(){
    $("#loadUrlButton").bind("click", function()
    {
        var url= $("#videoUrl").val();
        
        Player.loadPlaylistFromUrl(url);
    });
}
