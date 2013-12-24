//namespace
window.Player = window.Player || {};

window.Common = window.Common || {};

window.Player.MediaPlayer = function(configuration, container)
{
    this.instance = null;
    this.currentlyLoadedMediaDetails = new window.Player.MediaDetails();

    this.container = container;
    this.config = configuration;
};

window.Player.MediaPlayer.prototype =
{
    _createPlayerInstance: function(mediaDetails)
        {
            var successCallback = function(that, mediaDetails)
            {
                return function successCallback(mediaElement)
                {
                    that.instance = mediaElement;
                    that._initialise(mediaElement);

                    Logger.getInstance().Info("Media player has been initialised");
                    that._load(mediaDetails);
                    that.play();

                }
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
        //instance is set when player loading is finished
        new MediaElement(this.container, config);
    },

    _handleTimeUpdated: function(timeDetails)
    {
        EventBroker.getInstance().fireEventWithData(window.Player.Events.TimeUpdated, timeDetails);
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

    },

    _load: function(mediaDetails)
    {
        EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaChanged, this.currentlyLoadedMediaDetails);
        this.currentlyLoadedMediaDetails = mediaDetails;

        this.instance.setSrc(mediaDetails.url);
        this.instance.load();
    },

    load: function(mediaDetails)
    {
        if(mediaDetails != null)
        {
            if(this.instance == null)
            {
                this._createPlayerInstance(mediaDetails);
            }
            else
            {
                this._load(mediaDetails);
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

    setVolume: function(value)
    {
        if(this.instance != null)
            this.instance.setVolume(value);
    },

    getVolume: function()
    {   if(this.instance != null)
            return this.instance.volume;
        //TODO should return more appropriate value - e.g. default one from configuration
        return 1;
    }
};

