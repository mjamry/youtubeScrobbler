//namespace
window.Player = window.Player || {};

//namespace
window.Player.MediaPlayerConfig =
{
    // default if the <video width> is not specified
    defaultVideoWidth: 450,
    // default if the <video height> is not specified
    defaultVideoHeight: 338,
    // overrides <video width>
    pluginWidth: -1,
    // overrides <video height>
    pluginHeight: -1,
    enableAutosize: false,
    // shows debug errors on screen
    enablePluginDebug: false,
    alwaysShowControls: false,
    // remove or reorder to change plugin priority
    plugins: ['flash'],
    // specify to force MediaElement to use a particular video or audio type
   // type: ['video/youtube', 'video/webm'],
    pluginPath: 'media/',
    // name of flash file
    flashName: 'flashmediaelement.swf',
    // the order of controls you want on the control bar (and other plugins below)
    features: ['progress'],

    // rate in milliseconds for Flash and Silverlight to fire the timeupdate event
    // larger number is less accurate, but less strain on plugin->JavaScript bridge
    timerRate: 1000
};

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
};