//namespace
window.Player = window.Player || {};

window.Player.PlaylistElementDetailsProvider = function(playlistProvider, detailsProvider, sessionProvider)
{
    this.sessionProvider = sessionProvider;
    this.playlistProvider = playlistProvider;
    this.detailsProvider = detailsProvider;
};

window.Player.PlaylistElementDetailsProvider.prototype =
{
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

            this.detailsProvider.getTrackDetails(
                that.playlistProvider.getPlaylist().get(itemIndex),
                {
                    user: this.sessionProvider.getSession().name
                },
                {
                    done: done,
                    fail: fail
                }
            );
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