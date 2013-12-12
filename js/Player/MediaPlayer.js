//namespace
window.Player = window.Player || {};

window.Common = window.Common || {};

window.Player.MediaPlayer = function(configuration, container)
{
    this.instance = null;
    this.currentlyLoadedMediaDetails = new window.Player.MediaDetails();

    var config = $.extend(
        {
            success: $.proxy(function (mediaElement) {

                this.instance = mediaElement;
                this._initialise(mediaElement);

                Logger.getInstance().Info("Media player has been initialised");

               // this.instance.setVideoSize(300, 300);

            }, this),

            error: function ()
            {
                Logger.getInstance().Error("Media player initialisation failed.");
            }
        }, configuration
    );

    //instance is set when player loading is finished
    this.instance = new MediaElement(container, config);
};

window.Player.MediaPlayer.prototype =
{
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

    load: function(mediaDetails)
    {
        EventBroker.getInstance().fireEventWithData(window.Player.Events.MediaChanged, this.currentlyLoadedMediaDetails);
        this.currentlyLoadedMediaDetails = mediaDetails;
        if(this.currentlyLoadedMediaDetails)
        {
            this.instance.setSrc(mediaDetails.url);
            this.instance.load();
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
        this.instance.setVolume(value);
    },

    getVolume: function()
    {
        return this.instance.volume;
    }
};

