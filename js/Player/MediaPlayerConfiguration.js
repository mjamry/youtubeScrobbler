//namespace
window.Player = window.Player || {};

//namespace
window.Player.MediaPlayerConfig =
{
    // shows debug errors on screen
    enablePluginDebug: true,
    alwaysShowControls: true,
    // the order of controls you want on the control bar (and other plugins below)
    features: ['playpause','progress','current','duration','tracks','volume'],
    // default if the <video width> is not specified
    defaultVideoWidth: 100,
    // default if the <video height> is not specified
    defaultVideoHeight: 100,
    // overrides <video width>
    pluginWidth: 600,
    // overrides <video height>
    pluginHeight: -1,
    // rate in milliseconds for Flash and Silverlight to fire the timeupdate event
    // larger number is less accurate, but less strain on plugin->JavaScript bridge
    timerRate: 250
}

window.Player.LibraryEventsNames =
{
    loadeddata: 'loadeddata',
    progress: 'progress',
    timeupdate: 'timeupdate',
    seeked: 'seeked',
    canplay: 'canplay',
    play: 'play',
    playing: 'playing',
    pause: 'pause',
    loadedmetadata: 'loadedmetadata',
    ended: 'ended',
    volumechange: 'volumechange'
}