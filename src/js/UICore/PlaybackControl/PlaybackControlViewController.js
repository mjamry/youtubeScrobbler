//namespace
window.UI = window.UI || {};

window.UI.PlaybackControlViewController = function(playbackControl, volumeControlService, view, config)
{
    this.view = $("#"+view);
    this.playbackControl = playbackControl;
    this.volumeControlService = volumeControlService;
    this.config = config;

    this.volumeControl = null;
    this.playbackControlAllowed = true;
};

window.UI.PlaybackControlViewController.prototype =
{
    _play: function(playbackControl, that)
    {
        return function ()
        {
            if(that.playbackControlAllowed)
            {
                playbackControl.play();
                that._showPlayButton();
            }
        };
    },

    _pause: function(playbackControl, that)
    {
        return function ()
        {
            if(that.playbackControlAllowed)
            {
                playbackControl.pause();
                that._showPauseButton();
            }
        };
    },

    _next: function(playbackControl, that)
    {
        return function ()
        {
            if(that.playbackControlAllowed)
            {
                playbackControl.playNext();
            }
        };
    },

    _previous: function(playbackControl, that)
    {
        return function ()
        {
            if(that.playbackControlAllowed)
            {
                playbackControl.playPrevious();
            }
        };
    },

    _disableButtons: function()
    {
        $(this.config.PlayButton).addClass(this.config.Disabled);
        $(this.config.PauseButton).addClass(this.config.Disabled);
        $(this.config.NextButton).addClass(this.config.Disabled);
        $(this.config.PreviousButton).addClass(this.config.Disabled);
        this.playbackControlAllowed = false;
    },

    _enableButtons: function()
    {
        $(this.config.PlayButton).removeClass(this.config.Disabled);
        $(this.config.PauseButton).removeClass(this.config.Disabled);
        $(this.config.NextButton).removeClass(this.config.Disabled);
        $(this.config.PreviousButton).removeClass(this.config.Disabled);
        this.playbackControlAllowed = true;
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

    _handlePlaylistCreated: function()
    {
        this._enableButtons();
    },

    _handlePlaylistCleared: function()
    {
        this._disableButtons();
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

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, $.proxy(this._handlePlaylistCreated, this));
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCleared, $.proxy(this._handlePlaylistCleared, this));

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