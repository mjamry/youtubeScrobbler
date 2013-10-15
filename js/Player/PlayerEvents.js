//namespace
window.Player = window.Player || {};

//Represents enumeration of events fired by MediaPlayer
window.Player.Events =
{
    //TODO change video to media!
    //video events
    VideoPaused: "VideoPaused",
    VideoPlay: "VideoStarted",
    VideoStopped: "VideoStopped",
    VideoChanged: "VideoChanged",

    //playlist events
    PlaylistUpdated: "PlaylistUpdated"
};