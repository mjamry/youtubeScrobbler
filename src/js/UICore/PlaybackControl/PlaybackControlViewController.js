//namespace
window.UI = window.UI || {};

window.UI.PlaybackControlViewController = function(playbackControl, volumeControlService, videoSizeControlService, loveStateModifier, playlistService, view, config)
{
    this.view = view;
    this.playbackControl = playbackControl;
    this.playlistService = playlistService;
    this.volumeControlService = volumeControlService;
    this.loveStateModifier = loveStateModifier;
    this.sizeControl = videoSizeControlService;
    this.config = config;

    this.volumeControl = null;
    this.areControlsEnabled = false;
};

window.UI.PlaybackControlViewController.prototype =
{
    //changes love state for currently played track
    _changeLoveStateForCurrentTrack: function(that)
    {
        return function changeLoveStateForCurrentTrack()
        {
            that.loveStateModifier.toggleTrackLoveState(that._handleLoveStateChanged(that));
        };
    },

    //handles successful change of love state
    _handleLoveStateChanged: function(that)
    {
        return function _handleLoveStateChanged(index, mediaDetails)
        {
            that._setLoveStateForCurrentTrack(mediaDetails.loved);
            that.playlistService.updateItem(index, mediaDetails);
        };
    },

    //handles change of currently played track
    _handleMediaChanged: function(args)
    {
        this._setLoveStateForCurrentTrack(args.current.loved);
    },

    //changes visual indication of love state for current track
    _setLoveStateForCurrentTrack: function(isLoved)
    {
        if(isLoved)
        {
            $(this.config.LoveButton).addClass(this.config.SelectedButtonClass);
        }
        else
        {
            $(this.config.LoveButton).removeClass(this.config.SelectedButtonClass);
        }
    },

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
        this._showPlayButton();
        this.areControlsEnabled = false;
        this.volumeControl.disable();
        this.playbackProgressControl.disable();
    },

    _enableButtons: function()
    {
        this.view.find(this.config.PlaybackControlButtonClass).removeAttr(this.config.DisabledAttr);
        this.areControlsEnabled = true;
        this.volumeControl.enable();
        this.playbackProgressControl.enable();
    },

    _handleVolumeLevelChanged: function(that, volumeControlService)
    {
        return function(newVolumeLevel)
        {
            if(that.areControlsEnabled)
            {
                volumeControlService.setVolumeLevel(newVolumeLevel);
            }
        };
    },

    _handlePlaybackProgressChanged: function(that, playbackControl)
    {
        //playback progress value as percentage value
        return function changePlaybackProgress(newPlaybackProgressValue)
        {
            if(that.areControlsEnabled)
            {
                playbackControl.setPlaybackProgress(newPlaybackProgressValue);
            }
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

    _toggleFullScreenMode: function(sizeControl)
    {
        return function()
        {
            sizeControl.toggleFullScreenMode();
        };
    },

    initialise: function()
    {
        //hide pause button
        $(this.config.PauseButton).hide();

        //bind to player events
        EventBroker.getInstance().addListener(window.Player.Events.MediaPlay, $.proxy(this._showPauseButton, this));
        EventBroker.getInstance().addListener(window.Player.Events.MediaPaused, $.proxy(this._showPlayButton, this));
        EventBroker.getInstance().addListener(window.Player.Events.MediaStopped, $.proxy(this._showPlayButton, this));
        EventBroker.getInstance().addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);

        EventBroker.getInstance().addListener(window.UI.Events.DisableControlButtonsRequested, $.proxy(this._disableButtons, this));
        EventBroker.getInstance().addListener(window.UI.Events.EnableControlButtonsRequested, $.proxy(this._enableButtons, this));

        //create volume level change handler
        this.volumeControl = new window.UI.VolumeControl(window.UI.VolumeControlConfiguration.MainContainer, window.UI.VolumeControlConfiguration);
        var volumeLevelChangedHandler = this._handleVolumeLevelChanged(this, this.volumeControlService);
        this.volumeControl.bindToVolumeSet(volumeLevelChangedHandler);
        this.volumeControl.initialise(this.volumeControlService.getVolumeLevel());

        //create playback progress change handler
        this.playbackProgressControl = new window.UI.PlaybackProgressControl($("#playback-progress-container"));
        var playbackProgressValueChangedHandler = this._handlePlaybackProgressChanged(this, this.playbackControl);
        this.playbackProgressControl.bindToPlaybackProgressChangedEvent(playbackProgressValueChangedHandler);

        this.playbackProgressControl.initialise();

        this._disableButtons();

        //bind to ui events
        this.view.find(this.config.PlayButton).click(this._play(this.playbackControl, this));
        this.view.find(this.config.PauseButton).click(this._pause(this.playbackControl, this));
        this.view.find(this.config.NextButton).click(this._next(this.playbackControl));
        this.view.find(this.config.PreviousButton).click(this._previous(this.playbackControl));
        this.view.find(this.config.LoveButton).click(this._changeLoveStateForCurrentTrack(this));
        $(this.config.FullScreenModeButton).click(this._toggleFullScreenMode(this.sizeControl));
    }
};