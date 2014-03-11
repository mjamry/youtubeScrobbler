//namespace
window.Playlist = window.Playlist || {};

window.Playlist.PlaylistElementLoveStateModifier = function(innerModifier, sessionProvider, playlistService)
{
    this.innerModifier = innerModifier;
    this.sessionProvider = sessionProvider;
    this.playlistService = playlistService;
};

window.Playlist.PlaylistElementLoveStateModifier.prototype =
{
    toggleTrackLoveState: function(callback)
    {
        var currentItemIndex = this.playlistService.getPlaylist().currentItemIndex;
        var currentItemDetails = this.playlistService.getPlaylist().get(currentItemIndex);

        if(currentItemDetails.loved)
        {
            this._unlove(currentItemDetails, currentItemIndex, callback);
        }
        else
        {
            this._love(currentItemDetails, currentItemIndex, callback);
        }
    },

    _love: function(mediaDetails, index, successCallback)
    {
        var details =
        {
            details: mediaDetails,
            index: index
        };

        var callbacks =
        {
            success: function trackLoved(index, mediaDetails)
            {
                mediaDetails.loved = true;
                successCallback(index, mediaDetails);
            }
        };

        this.innerModifier.love(details, this.sessionProvider.getSession(), callbacks);
    },

    _unlove: function(mediaDetails, index, successCallback)
    {
        var details =
        {
            details: mediaDetails,
            index: index
        };

        var callbacks =
        {
            success: function trackUnloved(index, mediaDetails)
            {
                mediaDetails.loved = false;
                successCallback(index, mediaDetails);
            }
        };

        this.innerModifier.unLove(details, this.sessionProvider.getSession(), callbacks);
    }
};

