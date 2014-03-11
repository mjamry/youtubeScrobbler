//namespace
window.Player = window.Player || {};

//Represents enumeration of events fired by MediaPlayer
window.Player.Events =
{
    //media events
    MediaPaused: "MediaPaused",
    MediaPlay: "MediaStarted",
    MediaStopped: "MediaStopped",
    MediaChanged: "MediaChanged", //args={current, previous}

    TimeUpdated: "TimeUpdated",
    PlaybackDetailsUpdated: "PlaybackDetailsUpdated"
};