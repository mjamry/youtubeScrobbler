//namespace
window.Player = window.Player || {};

window.Common = window.Common || {};

window.Player.MediaPlayer = function(configuration, container, playlistService)
{
    this.instance = null;
    this.currentlyLoadedMediaDetails = new window.Player.MediaDetails();

    this.container = container;
    this.config = configuration;
    this.playlistService = playlistService;
    EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, $.proxy(this._handlePlaylistCreated, this));
    EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCleared, $.proxy(this._handlePlaylistCleared, this));
};

window.Player.MediaPlayer.prototype =
{
    _updateCurrentMediaDetails: function(newMediaDetails)
    {
        var previousMediaDetails = this.currentlyLoadedMediaDetails;
        this.currentlyLoadedMediaDetails = newMediaDetails;
        EventBroker.getInstance().fireEventWithData(
            window.Player.Events.MediaChanged,
            {
                current: this.currentlyLoadedMediaDetails,
                previous: previousMediaDetails
            });
    },

    _createPlayerInstance: function(mediaDetails)
        {
            var successCallback = function(that, mediaDetails)
            {
                return function mediaPlayerInitialisationSuccessCallback(mediaElement)
                {
                    that.instance = mediaElement;
                    that._initialise(mediaElement);

                    Logger.getInstance().Info("Media player has been initialised");
                    that._load(mediaDetails);
                    that._updateCurrentMediaDetails(mediaDetails);
                };
            };

            var config = $.extend(
            {
                success: successCallback(this, mediaDetails),
                error: function ()
                {
                    Logger.getInstance().Error("Media player initialisation failed.");
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
        this._createPlayerInstance(this.playlistService.getCurrentItemDetails());
    },

    _handlePlaylistCleared: function()
    {
        if(this.instance !== null)
        {
            this.pause();
            this.instance.remove();
            this.instance = null;
        }
    },

    //initialises events for player
    _initialise: function(mediaElement)
    {
        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.play,
            $.proxy(function()
                {
                    EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaPlay, this.currentlyLoadedMediaDetails);
                },
                this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.ended,
            $.proxy(function()
                {
                    EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaStopped, this.currentlyLoadedMediaDetails);
                },
                this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.pause,
            $.proxy(function()
                {
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
                    //this has to be done here as changing volume before full initialisation does not work
                    this.setVolume(this.config.startVolume);
                    //this.play();
                    //needed by UI controllers to refresh its states
                   // EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaPlay, this.currentlyLoadedMediaDetails);
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
    }
};

