//namespace
window.Player = window.Player || {};

window.Common = window.Common || {};

window.Player.MediaPlayer = function(configuration, container, playlistDetailsProvider)
{
    this.instance = null;
    this.currentlyLoadedMediaDetails = null;

    this.container = container;
    this.config = configuration;
    this.playlistDetailsProvider = playlistDetailsProvider;
    this.playbackState = new window.Player.PlaybackStateHolder();

    //these event handler definitions have to be here (not in _initialise method) as it is called after player creation
    EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, $.proxy(this._handlePlaylistCreated, this));
    EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCleared, $.proxy(this._handlePlaylistCleared, this));
};

window.Player.MediaPlayer.prototype =
{
    _updateCurrentMediaDetails: function(newMediaDetails)
    {
        var previousMediaDetails = this.currentlyLoadedMediaDetails;
        this.currentlyLoadedMediaDetails = newMediaDetails;
        if(previousMediaDetails !== null) {
            EventBroker.getInstance().fireEventWithData(
                window.Player.Events.MediaChanged,
                {
                    current: this.currentlyLoadedMediaDetails,
                    previous: previousMediaDetails
                });
        }
    },

    _createPlayerInstance: function(mediaDetails)
        {
            var successCallback = function(that, mediaDetails)
            {
                return function mediaPlayerInitialisationSuccessCallback(mediaElement)
                {
                    LoadingIndicatorService.getInstance().show("Please be patient.<br>Player is being loaded.");
                    that.instance = mediaElement;
                    that._initialise(mediaElement);

                    Logger.getInstance().info("Media player has been initialised");
                    that._load(mediaDetails);
                    that._updateCurrentMediaDetails(mediaDetails);

                    that.playbackState.changeToStop();
                    EventBroker.getInstance().fireEventWithData(window.Player.Events.PlayerCreated, that.currentlyLoadedMediaDetails);
                    LoadingIndicatorService.getInstance().hide();
                };
            };

            var config = $.extend(
            {
                success: successCallback(this, mediaDetails),
                error: function ()
                {
                    Logger.getInstance().error("Media player initialisation failed.");
                    throw "Sorry, but your browser does not support Flash.<br>Please install appropriate plugin.";
                }
            }, this.config
        );

        //create new player - instance is set in success callback
        new MediaElement(this.container, config);

    },

    _handleTimeUpdated: function(timeDetails)
    {
        EventBroker.getInstance().fireEventWithData(window.Player.Events.TimeUpdated, timeDetails);
    },

    _handlePlaylistCreated: function()
    {
        this._createPlayerInstance(this.playlistDetailsProvider.getCurrentItemDetails());
    },

    _handlePlaylistCleared: function()
    {
        if(this.instance !== null)
        {
            this.pause();
            this.instance.remove();
            this.instance = null;
        }

        this.currentlyLoadedMediaDetails = null;
    },

    //initialises events for player
    _initialise: function(mediaElement)
    {
        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.play,
            $.proxy(function()
                {
                    this.playbackState.changeToPlay();
                    EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaPlay, this.currentlyLoadedMediaDetails);
                },
                this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.ended,
            $.proxy(function()
                {
                    this.playbackState.changeToStop();
                    EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaStopped, this.currentlyLoadedMediaDetails);
                },
                this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.pause,
            $.proxy(function()
                {
                    this.playbackState.changeToPause();
                    EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaPaused, this.currentlyLoadedMediaDetails);
                },
                this),
            false
        );

        mediaElement.addEventListener(window.Player.LibraryEventsNames.timeupdate, this._handleTimeUpdated, null, this);

        //this is needed to force auto play after player initialisation.
        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.canplay,
            $.proxy(function()
                {
                    this.setVolume(this.config.startVolume);
                    //TODO: here will be code responsible for autoplay after creating new playlist - it should be configurable
                },
                this),
            false
        );
    },

    _load: function(mediaDetails)
    {
        var source =
        [{
            src: mediaDetails.url,
            type: mediaDetails.mediaType
        }];
        this.instance.setSrc(source);
        this.instance.load();
    },

    load: function(mediaDetails)
    {
        if(mediaDetails !== null)
        {
            //when media type has been changed - recreate plugin
            if(this.currentlyLoadedMediaDetails.mediaType != mediaDetails.mediaType && this.instance !== null)
            {
                this.instance.remove();
                this.instance = null;
            }

            if(this.instance === null)
            {
                this._createPlayerInstance(mediaDetails);
            }
            else
            {
                this._load(mediaDetails);
                this._updateCurrentMediaDetails(mediaDetails);
            }
        }
    },

    play: function()
    {
        this.instance.play();
    },

    pause: function()
    {
        this.instance.pause();
    },

    //progress as a percentage value
    setPlaybackProgress: function(progressValue)
    {
        if(this.currentlyLoadedMediaDetails)
        {
            var newProgressValueInSeconds = (this.currentlyLoadedMediaDetails.duration.getInSeconds() * progressValue)/100;
            this.instance.setCurrentTime(newProgressValueInSeconds);
            EventBroker.getInstance().fireEventWithData(window.Player.Events.TimeUpdated, newProgressValueInSeconds);
        }
    },

    setVolume: function(value)
    {
        if(this.instance !== null)
        {
            this.instance.setVolume(value);
        }
        else
        {
            this.config.startVolume = value;
        }
    },

    getVolume: function()
    {
        if(this.instance !== null)
        {
            return this.instance.volume;
        }

        return this.config.startVolume;
    },

    getCurrentMediaDetails: function()
    {
        return this.currentlyLoadedMediaDetails;
    },

    getPlaybackState: function()
    {
        return this.playbackState.getCurrentState();
    },

    setSize: function(width, height)
    {
        this.instance.setVideoSize(width, height);
    }
};