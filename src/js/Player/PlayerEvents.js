//namespace
window.Player = window.Player || {};

//Represents enumeration of events fired by MediaPlayer
window.Player.Events =
{
    //media events
    PlayerCreated: "PlayerCreated",
    MediaPaused: "MediaPaused",
    MediaPlay: "MediaStarted",
    MediaStopped: "MediaStopped",
    MediaChanged: "MediaChanged", //args={current, previous}

    TimeUpdated: "TimeUpdated",
    PlaybackDetailsUpdated: "PlaybackDetailsUpdated"
};