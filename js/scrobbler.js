var Player;
var VIDEO_ID = "8SbUC-UaAxE";
var URL = "http://www.youtube.com/watch?v=8SbUC-UaAxE&list=RD029Q7Vr3yQYWQ";

YT_PLAYER_STATES = {
    PLAYING: 1,
    PAUSED: 2 
};

$(function()
{
    InitialisePlayer();
    
});

function InitialisePlayer()
{
    var params = { allowScriptAccess: "always" };
    var atts = { id: "myytplayer" };
    swfobject.embedSWF("http://www.youtube.com/v/"+VIDEO_ID+"?enablejsapi=1&playerapiid=ytplayer&version=3",
                       "flashPlayer", "425", "356", "6", null, null, params, atts);
                       
    $("#loadUrlButton").bind("click", function()
    {
        var QUALITY = "medium";
        URL = $("#videoUrl").val();
        var playlistId = GetParameterFromUrl(URL, "list");
        VIDEO_ID = GetParameterFromUrl(URL, "v");
        var isPlaylist = typeof playlistId !== "undefined";
        var content = "video id: "+ VIDEO_ID +"<br>";
        content += "type: " + (isPlaylist ? "playlist":"single video");
        $("#videoInfo").html(content);
        if(isPlaylist)
        {
            Player.loadPlaylist(playlistId,"playlist",0,0,"medium");
        }
        else
        {
            Player.loadVideoById(VIDEO_ID,0,QUALITY);
        }
    });                 
    
}

function GetParameterFromUrl(url, parameter)
{
    var urlParts = url.split("?");
    var params = urlParts[1].split("&"); 
    for(var i=0;i<params.length;i++)
    {
        var value = params[i].split("=");
        if(value[0] === parameter)
        {
            return value[1];
        }
    }
}

function OnPlayerStateChanged(state)
{
    //console.log("new state: "+state);
    switch(state){
        case YT_PLAYER_STATES.PLAYING:
            console.log("playing");
            $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+VIDEO_ID+'?v=2&alt=jsonc',function(data,status,xhr){
                alert(data.data.title);
            });
            break;
        case YT_PLAYER_STATES.PAUSED:
            console.log("paused");
            break;
    }
}

function onYouTubePlayerReady(playerId)
{
    Player = document.getElementById("myytplayer");
    Player.addEventListener("onStateChange", "OnPlayerStateChanged");
    //Player.loadVideoById(VIDEO_ID, 60, "medium");
    $("#play").click(
        function(){
            Play();
        });
}

function Play(){
    
    Player.playVideo();
    Player.setLoop(true);
    
    
}