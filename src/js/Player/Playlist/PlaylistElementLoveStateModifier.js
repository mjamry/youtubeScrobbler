//namespace
window.Playlist = window.Playlist || {};

window.Playlist.PlaylistElementLoveStateModifier = function(innerModifier, sessionProvider, playlistService)
{
    this.innerModifier = innerModifier;
    this.sessionProvider = sessionProvider;
    this.playlistService = playlistService;
    this.modificationAllowed = false;
};

window.Playlist.PlaylistElementLoveStateModifier.prototype =
{
    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, $.proxy(function(){this.modificationAllowed = true;}, this));
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCleared, $.proxy(function(){this.modificationAllowed = false;}, this));
    },

    changeTrackLoveState: function(callback)
    {
        if(this.modificationAllowed)
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

