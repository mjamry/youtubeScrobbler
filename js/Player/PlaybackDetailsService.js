//using
window.Player = window.Player || {};

window.Player.PlaybackDetailsService = function()
{

};

window.Player.PlaybackDetailsService.prototype =
{
    _handleTimeUpdated: function(details)
    {

    },

    _handleMediaPaused: function(details)
    {

    },

    _handleMediaChanged: function(details)
    {

    },

    _handleMediaPlay: function(details)
    {

    },

    _updatePlaybackDetails: function()
    {
        window.Common.EventBrokerSingleton.instance().fireEvent(window.Player.Events.PlaybackDetailsUpdateRequested);
    },

    initialise: function()
    {
        var eventBroker = window.Common.EventBrokerSingleton.instance();

        eventBroker.addListener(window.Player.Events.TimeUpdated, this._handleTimeUpdated, null, this);

        eventBroker.addListener(window.Player.Events.MediaPaused, this._handleMediaPaused, null, this);
        eventBroker.addListener(window.Player.Events.MediaStopped, this._handleMediaStopped, null, this);
        eventBroker.addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);
        eventBroker.addListener(window.Player.Events.MediaPlay, this._handleMediaPlay, null, this);
    }
};