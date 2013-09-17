//namespace
window.Player = window.Player || {};

//Represents enumeration of events fired by YouTubePlayer
window.Player.Events =
{
    //0-9 - general events
    playerReady: 0,
    error:1,

    //10-19 - video events
    videoLoaded:10,
    videoPaused:11,
    videoPlay:12,
    videoCue:13,
    videoBuffering:14,

    playlistReady:15,
    beforePlaylistReady:16
};