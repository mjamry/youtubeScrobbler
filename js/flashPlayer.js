var YTPlayer;

$(function(){
    ConfigurePlayer();
    HookUpHeaderMouseEvents();
    HookUpLoadUrlButtonAction();
    InitialiseEventHandler();
});

function InitialiseEventHandler(){
    var handler = new eventHandler(
        {
            onStart: "start",
            onEnd: "end",
            onMiddle: "middle"
        });
     
     handler.addListener(handler.events.onStart, fun, "onStart!");
     handler.addListener(handler.events.onStart, function(){
        alert("onStart second!"); 
     });
     
     handler.fireEvent(handler.events.onStart);
}

function fun(data){
        alert(data); 
     }

function ConfigurePlayer()
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
                onVideoLoad: function(video){
                VideoLoaded(video);
            },
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

    YTPlayer = $('.youtube-player').player(config);
}
var playerRepeatPlaylist = +0;

function VideoLoaded(video){
    console.log("id: "+video.id+" title: "+video.title);
    $("#player .title").text("Video: "+video.title);
    $("title").text(video.title);
}

function HookUpLoadUrlButtonAction(){
    $("#loadUrlButton").bind("click", function()
    {
      //  var QUALITY = "medium";
        var url= $("#videoUrl").val();
        
        var loader = new videoLoader();
        loader.loadPlaylistFromUrl(url, UpdatePlaylist);
    });
}

function UpdatePlaylist(playlist)
{
    YTPlayer.player("loadPlaylist", playlist);
    //var pl = YTPlayer.player("elements.playerObject");
    //var url = pl.getVideoUrl();
   // console.log("vd: "+video);
}


function HookUpHeaderMouseEvents(){
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
    
    
    HookPlayerActionToButton("play_button", "playVideo");
    HookPlayerActionToButton("pause_button", "pauseVideo");
    HookPlayerActionToButton("next_button", "nextVideo");
    HookPlayerActionToButton("prev_button", "prevVideo");
    $("#repeat_button a").click(function(){
        $(this).toggleClass("button_selected");
        playerRepeatPlaylist = (playerRepeatPlaylist === 0 ? 1 : 0);
        var options = {
            repeatPlaylist: playerRepeatPlaylist
        };
        console.log("rep: "+playerRepeatPlaylist+" opt: "+options.repeatPlaylist);
        YTPlayer.player(options);
    });
        
}

function HookPlayerActionToButton(button, action)
{
    $("#"+button).find("a").click(function(){
        YTPlayer.player(action);
        return false;
    });
}

    


