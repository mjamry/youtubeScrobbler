//namespace
window.Player = window.Player || {};

//Represents enumeration of events fired by MediaPlayer
window.Player.Events =
{
    //media events
    MediaPaused: "MediaPaused",
    MediaPlay: "MediaStarted",
    MediaStopped: "MediaStopped",
    MediaChanged: "MediaChanged",

    TimeUpdated: "TimeUpdated",
    PlaybackDetailsUpdated: "PlaybackDetailsUpdated"
};