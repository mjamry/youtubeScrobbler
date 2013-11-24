//namespace
window.Player = window.Player || {};

//TODO pass here a session provider
window.Player.PlaylistElementDetailsProvider = function(playlistProvider, detailsProvider)
{
    this.playlistProvider = playlistProvider;
    this._detailsProvider = detailsProvider;
    this._currentItemIndex = 0;
    this._itemsToGetDetails = 0;
};

window.Player.PlaylistElementDetailsProvider.prototype =
{
    _updateProgressbar: function()
    {
        var progressBarPercentValue = ((this._itemsToGetDetails - (this.playlistProvider.getPlaylist().length() - this._currentItemIndex))/this._itemsToGetDetails)*100;
        $("#playlist-progressbar").css({width:progressBarPercentValue+"%"});
        if(progressBarPercentValue == 100)
        {
            $("#playlist-progressbar").hide();
        }
    },

    _handleDetailsObtained: function(itemIndex, that)
    {
        return function(mediaDetails)
        {
            that.playlistProvider.updateItem(itemIndex, mediaDetails);
            itemIndex++;
            that._getDetails(itemIndex, that);
        }
    },

    _handleObtainingError: function(itemIndex, that)
    {
        return function()
        {
            itemIndex++;
            that._getDetails(itemIndex, that);
        }
    },

    _getDetails: function(itemIndex, that)
    {
        if(itemIndex < that.playlistProvider.getPlaylist().length())
        {
            var done = that._handleDetailsObtained(itemIndex, that);
            var fail = that._handleObtainingError(itemIndex, that);

            this._detailsProvider.getTrackDetails(that.playlistProvider.getPlaylist().get(itemIndex),{user: "onlinescrobbler"}, {done: done, fail: fail});
        }
    },

    _handlePlaylistUpdated: function(numberOfNewItems)
    {
        var itemIndex = this.playlistProvider.getPlaylist().length() - numberOfNewItems;
        this._getDetails(itemIndex, this);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._handlePlaylistUpdated, null, this);
    }
};