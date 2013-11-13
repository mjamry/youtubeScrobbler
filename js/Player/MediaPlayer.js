//namespace
window.Player = window.Player || {};

window.Common = window.Common || {};

window.Player.MediaPlayer = function(configuration, container)
{
    this.instance = null;
    this._eventBroker = window.Common.EventBrokerSingleton.instance();
    this.currentlyLoadedMediaDetails = new window.Player.MediaDetails();

    var config = $.extend(
        {
            success: $.proxy(function (mediaElement) {

                this.instance = mediaElement;
                this._initialise(mediaElement);
                window.Common.Log.Instance().Info("Media player has been initialised");

                window.Common.Log.Instance().Debug(this.instance.options.height);
                this.instance.setVideoSize(300, 300);

            }, this),

            error: function ()
            {
                window.Common.Log.Instance().Error("MediaElement initialisation failed.");
            }
        }, configuration
    );

    //instance is set when player loading is finished
    this.instance = new MediaElement(container, config);
};

window.Player.MediaPlayer.prototype =
{
    //initialises events for player
    _initialise: function(mediaElement)
    {
        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.play,
            $.proxy(function(){this._eventBroker.fireEventWithData(window.Player.Events.MediaPlay, this.currentlyLoadedMediaDetails);}, this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.ended,
            $.proxy(function(){this._eventBroker.fireEventWithData(window.Player.Events.MediaStopped, this.currentlyLoadedMediaDetails);}, this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.pause,
            $.proxy(function(){this._eventBroker.fireEventWithData(window.Player.Events.MediaPaused, this.currentlyLoadedMediaDetails);}, this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.timeupdate,
            $.proxy(function(){this._eventBroker.fireEventWithData(window.Player.Events.TimeUpdated, this.currentlyLoadedMediaDetails);}, this),
            false
        );

    },

    load: function(mediaDetails)
    {
        this._eventBroker.fireEventWithData(window.Player.Events.MediaChanged, this.currentlyLoadedMediaDetails);
        this.currentlyLoadedMediaDetails = mediaDetails;
        this.instance.setSrc(mediaDetails.url);
        this.instance.load();
    },

    play: function()
    {
        this.instance.play();
    }
};

