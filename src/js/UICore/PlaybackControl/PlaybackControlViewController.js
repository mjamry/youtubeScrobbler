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

window.UI.PlaybackControlViewController.prototype =
{
    _play: function(playbackControl, that)
    {
        return function ()
        {
            playbackControl.play();
            that._showPlayButton();
        };
    },

    _pause: function(playbackControl, that)
    {
        return function ()
        {
            playbackControl.pause();
            that._showPauseButton();
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

    _disableButtons: function()
    {
        this.view.find(this.config.PlaybackControlButtonClass).attr(this.config.DisabledAttr, true);
    },

    _enableButtons: function()
    {
        this.view.find(this.config.PlaybackControlButtonClass).removeAttr(this.config.DisabledAttr);
    },

    _handleVolumeLevelChanged: function(volumeControlService)
    {
        return function(newVolumeLevel)
        {
            volumeControlService.setVolumeLevel(newVolumeLevel);
        };
    },

    _handlePlaybackProgressChanged: function(playbackControl)
    {
        //playback progress value as percentage value
        return function changePlaybackProgress(newPlaybackProgressValue)
        {
           playbackControl.setPlaybackProgress(newPlaybackProgressValue);
        };
    },

    _showPlayButton: function()
    {
        $(this.config.PlayButton).show();
        $(this.config.PauseButton).hide();
    },

    _showPauseButton: function()
    {
        $(this.config.PlayButton).hide();
        $(this.config.PauseButton).show();
    },

    initialise: function()
    {
        //hide pause button
        $(this.config.PauseButton).hide();
        this._disableButtons();

        //bind to player events
        EventBroker.getInstance().addListener(window.Player.Events.MediaPlay, $.proxy(this._showPauseButton, this));
        EventBroker.getInstance().addListener(window.Player.Events.MediaPaused, $.proxy(this._showPlayButton, this));
        EventBroker.getInstance().addListener(window.Player.Events.MediaStopped, $.proxy(this._showPlayButton, this));

        EventBroker.getInstance().addListener(window.UI.Events.DisableControlButtonsRequested, $.proxy(this._disableButtons, this));
        EventBroker.getInstance().addListener(window.UI.Events.EnableControlButtonsRequested, $.proxy(this._enableButtons, this));

        //create volume level change handler
        this.volumeControl = new window.UI.VolumeControl("playback-control-volume-container");
        var volumeLevelChangedHandler = this._handleVolumeLevelChanged(this.volumeControlService);
        this.volumeControl.bindToVolumeSet(volumeLevelChangedHandler);
        this.volumeControl.initialise(this.volumeControlService.getVolumeLevel());

        //create playback progress change handler
        this.playbackProgressControl = new window.UI.PlaybackProgressControl($("#playback-progress-container"));
        var playbackProgressValueChangedHandler = this._handlePlaybackProgressChanged(this.playbackControl);
        this.playbackProgressControl.bindToPlaybackProgressChangedEvent(playbackProgressValueChangedHandler);

        this.playbackProgressControl.initialise();

        //bind to ui events
        this.view.find(this.config.PlayButton).click(this._play(this.playbackControl, this));
        this.view.find(this.config.PauseButton).click(this._pause(this.playbackControl, this));
        this.view.find(this.config.NextButton).click(this._next(this.playbackControl, this));
        this.view.find(this.config.PreviousButton).click(this._previous(this.playbackControl, this));
    }
};