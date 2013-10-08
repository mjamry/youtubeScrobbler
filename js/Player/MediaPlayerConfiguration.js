//namespace
window.Player = window.Player || {};

//namespace
window.Player.MediaPlayerConfig =
{
    // shows debug errors on screen
    enablePluginDebug: true,
    alwaysShowControls: true,
    // remove or reorder to change plugin priority
    plugins: ['flash','silverlight'],
    // specify to force MediaElement to use a particular video or audio type
   // type: ['video/youtube', 'video/webm'],
    // path to Flash and Silverlight plugins
    pluginPath: 'media/',
    // name of flash file
    flashName: 'flashmediaelement.swf',
    // name of silverlight file
    silverlightName: 'silverlightmediaelement.xap',
    // the order of controls you want on the control bar (and other plugins below)
    features: ['playpause','progress','current'],
    // default if the <video width> is not specified
    defaultVideoWidth: 600,
    // default if the <video height> is not specified
    defaultVideoHeight: 400,
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