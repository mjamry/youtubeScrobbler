//namespace
window.Player = window.Player || {};

window.Player.PlaylistElementDetailsProvider = function(playlistProvider, detailsProvider, sessionProvider)
{
    this.sessionProvider = sessionProvider;
    this.playlistProvider = playlistProvider;
    this.detailsProvider = detailsProvider;

    //TODO - use as a service, only temporarily here
    this.progressbarService = new window.UI.ProgressbarService();
    this.progressbarId = null;
    this.numberOfNewItems = 0;
};

window.Player.PlaylistElementDetailsProvider.prototype =
{
    _updateProgressbar: function(itemIndex, that)
    {
        var progress = itemIndex - (that.playlistProvider.getPlaylist().length() - this.numberOfNewItems);
        that.progressbarService.updateProgressbar(that.progressbarId, progress);
    },

    _handleDetailsObtained: function(itemIndex, that)
    {
        return function(mediaDetails)
        {
            that.playlistProvider.updateItem(itemIndex, mediaDetails);
            itemIndex++;
            that._getDetails(itemIndex, that);
            that._updateProgressbar(itemIndex, that);
        };
    },

    _handleObtainingError: function(itemIndex, that)
    {
        return function()
        {
            //there was an error with downloading details (probably there was something wrong with artist/track name).
            //do not care about that, just get details for next item.
            itemIndex++;
            that._getDetails(itemIndex, that);
            that._updateProgressbar(itemIndex, that);
        };
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
        this.numberOfNewItems = numberOfNewItems;
        if(this.numberOfNewItems)
        {
            var itemIndex = this.playlistProvider.getPlaylist().length() - this.numberOfNewItems;
            this.progressbarId = this.progressbarService.addNewProgressbar(this.numberOfNewItems, "updating playlist items with lastfm data");
            this._getDetails(itemIndex, this);
        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._handlePlaylistUpdated, null, this);
    }
};