//namespace
window.Player = window.Player || {};

window.Common = window.Common || {};

window.Player.MediaPlayer = function(configuration)
{
    this.instance = null;
    this._eventBroker = window.Common.EventBrokerSingleton.instance();
    this.currentlyLoadedMediaDetails = new window.Player.MediaDetails();

    var config = $.extend(
        {
            success: $.proxy(function (mediaElement, domObject) {

                this.instance = mediaElement;
                this._initialise(mediaElement);
            }, this),

            error: function ()
            {
                window.Common.Log.Instance().Error("MediaElement initialisation failed.");
            }
        }, configuration
    );

    window.Common.Log.Instance().Debug("Media playes initialisation");
     new MediaElement('media_player', config);
    window.Common.Log.Instance().Debug("Media playes initialisation finished");
};

window.Player.MediaPlayer.prototype =
{
    //initialises events for player
    _initialise: function(mediaElement)
    {
        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.play,
            $.proxy(function(){this._eventBroker.fireEventWithData(window.Player.Events.videoPlay, this.currentlyLoadedMediaDetails);}, this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.ended,
            $.proxy(function(){this._eventBroker.fireEventWithData(window.Player.Events.videoStoped, this.currentlyLoadedMediaDetails);}, this),
            false
        );

        mediaElement.addEventListener(
            window.Player.LibraryEventsNames.pause,
            $.proxy(function(){this._eventBroker.fireEventWithData(window.Player.Events.videoPaused, this.currentlyLoadedMediaDetails);}, this),
            false
        );
    }
}

