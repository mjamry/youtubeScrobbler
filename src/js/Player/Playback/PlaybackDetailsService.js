//using
window.Player = window.Player || {};

window.Player.PlaybackDetailsService = function(mediaDetailsProvider, playbackStateProvider)
{
    this.mediaDetailsProvider = mediaDetailsProvider;
    this.playbackState = playbackStateProvider;
    this.playbackDetails = null;
};

window.Player.PlaybackDetailsService.prototype =
{
    _handleTimeUpdated: function(details)
    {
        this.playbackDetails = details;
        this._updatePlaybackDetails();
    },

    _handleMediaPaused: function()
    {
        this._updatePlaybackDetails();
    },

    _handleMediaChanged: function()
    {
        this._updatePlaybackDetails();
    },

    _handleMediaStopped: function()
    {
        this._updatePlaybackDetails();
    },

    _handleMediaPlay: function()
    {
        this._updatePlaybackDetails();
    },

    _updatePlaybackDetails: function()
    {
        if(this.playbackDetails && this.playbackDetails.duration > 0)
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
        eventBroker.addListener(window.Player.Events.MediaChanged, this._handleMediaStopped, null, this);
        eventBroker.addListener(window.Player.Events.MediaPlay, this._handleMediaPlay, null, this);
    },

    getPlaybackState: function()
    {
        return this.playbackState.getPlaybackState();
    },

    getMediaDetails: function()
    {
        return this.mediaDetailsProvider.getCurrentMediaDetails();
    },

    getPlaybackTime: function()
    {
        return TimeParser.getInstance().getHumanReadableTimeFormat(this.playbackDetails.currentTime);
    },

    getDuration: function()
    {
        return TimeParser.getInstance().getHumanReadableTimeFormat(this.playbackDetails.duration);
    },

    getPlaybackProgress: function()
    {
        return (( this.playbackDetails.currentTime / this.playbackDetails.duration ) * 100);
    },

    getDataProgress: function()
    {
        return (( this.playbackDetails.bufferedBytes / this.playbackDetails.bytesTotal ) * 100);
    },

    clearData: function()
    {
        this.playbackDetails =
        {
            currentTime: 0,
            duration: 0,
            bufferedBytes: 0,
            bytesTotal: 0
        };
    }
};