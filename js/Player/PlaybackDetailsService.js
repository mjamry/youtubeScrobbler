//using
window.Player = window.Player || {};

window.Player.PlaybackDetailsService = function()
{
    this.state = new window.Player.PlaybackState();
    this.currentMediaDetails = null;
    this.playbackDetails =
    {
        currentTime:0,
        duration:0
    };
};

window.Player.PlaybackDetailsService.prototype =
{
    _handleTimeUpdated: function(details)
    {
        this.playbackDetails = details;
        this._updatePlaybackDetails();
    },

    _handleMediaPaused: function(details)
    {
        this.state.changeState(this.state.paused);
        this.currentMediaDetails = details;
        this._updatePlaybackDetails();
    },

    _handleMediaChanged: function(details)
    {
        this.state.changeState(this.state.playing);
        this.currentMediaDetails = details;
        this._updatePlaybackDetails();
    },

    _handleMediaStopped: function(details)
    {
        this.state.changeState(this.state.stoped);
        this.currentMediaDetails = details;
        this._updatePlaybackDetails();
    },

    _handleMediaPlay: function(details)
    {
        this.state.changeState(this.state.playing);
        this.currentMediaDetails = details;
        this._updatePlaybackDetails();
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
    },

    getPlaybackState: function()
    {
        return this.state.getCurrentState();
    },

    getMediaDetails: function()
    {
        return this.currentMediaDetails;
    },

    getPlaybackTime: function()
    {
        return TimeParser.getInstance().getHumanReadibleFormat(this.playbackDetails.currentTime);
    },

    getDuration: function()
    {
        return TimeParser.getInstance().getHumanReadibleFormat(this.playbackDetails.duration);
    }
};