//using
window.Player = window.Player || {};

window.Player.PlaybackDetailsService = function()
{
    this.state = new window.Player.PlaybackState();
    this.currentMediaDetails = null;
    this.playbackDetails = null;
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
        if(this.currentMediaDetails && this.playbackDetails && this.playbackDetails.duration > 0)
        {
            EventBroker.getInstance().fireEvent(window.Player.Events.PlaybackDetailsUpdated);
        }
    },

    initialise: function()
    {
        var eventBroker = EventBroker.getInstance();

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
        return TimeParser.getInstance().getHumanReadableFormat(this.playbackDetails.currentTime);
    },

    getDuration: function()
    {
        return TimeParser.getInstance().getHumanReadableFormat(this.playbackDetails.duration);
    },

    getPlaybackProgress: function()
    {
        return (( this.playbackDetails.currentTime / this.playbackDetails.duration ) * 100);
    },

    getDataProgress: function()
    {
        return (( this.playbackDetails.bufferedBytes / this.playbackDetails.bytesTotal ) * 100);
    }
};