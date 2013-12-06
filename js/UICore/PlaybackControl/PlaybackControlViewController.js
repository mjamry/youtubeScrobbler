//namespace
window.UI = window.UI || {};

window.UI.PlaybackControlViewController = function(playbackControl, volumeControlService, view, config)
{
    this.view = $("#"+view);
    this.playbackControl = playbackControl;
    this.volumeControlService = volumeControlService;
    this.config = config;

    this.volumeControl = null;
};

//TODO add volume control.
window.UI.PlaybackControlViewController.prototype =
{
    _play: function(playbackControl)
    {
        return function ()
        {
            playbackControl.play();
        };
    },

    _pause: function(playbackControl)
    {
        return function ()
        {
            playbackControl.pause();
        };
    },

    _next: function(playbackControl)
    {
        return function ()
        {
            playbackControl.playNext();
        };
    },

    _previous: function(playbackControl)
    {
        return function ()
        {
            playbackControl.playPrevious();
        };
    },

    _handleVolumeLevelChanged: function(volumeControlService)
    {
        return function(newVolumeLevel)
        {
            volumeControlService.setVolumeLevel(newVolumeLevel);
        }
    },

    initialise: function()
    {
        this.volumeControl = new window.UI.VolumeControl("playback-control-volume-container");

        var volumeLevelChangedHandler = this._handleVolumeLevelChanged(this.volumeControlService);
        this.volumeControl.bindToVolumeSet(volumeLevelChangedHandler);

        this.volumeControl.initialise(this.volumeControlService.getVolumeLevel());

        //bind to ui events
        this.view.find(this.config.PlayButton).click(this._play(this.playbackControl));
        this.view.find(this.config.PauseButton).click(this._pause(this.playbackControl));
        this.view.find(this.config.NextButton).click(this._next(this.playbackControl));
        this.view.find(this.config.PreviousButton).click(this._previous(this.playbackControl));
    }
};