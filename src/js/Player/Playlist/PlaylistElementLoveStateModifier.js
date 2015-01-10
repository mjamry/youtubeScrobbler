//namespace
window.Playlist = window.Playlist || {};

window.Playlist.PlaylistElementLoveStateModifier = function(innerModifier, playlistDetailsProvider)
{
    this.innerModifier = innerModifier;
    this.playlistDetailsProvider = playlistDetailsProvider;
};

window.Playlist.PlaylistElementLoveStateModifier.prototype =
{
    toggleTrackLoveState: function(callback)
    {
        var currentItemIndex = this.playlistDetailsProvider.getCurrentItemIndex();
        var currentItemDetails = this.playlistDetailsProvider.getCurrentItemDetails();

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
        var success = function()
        {
            mediaDetails.loved = true;
            successCallback(index, mediaDetails);

            UserNotifier.getInstance().info("'"+mediaDetails.artist.name+" - "+mediaDetails.title+"' has been loved.");
        };

        this.innerModifier.love(
            mediaDetails,
            {
                success: success,
                error: function(){}
            });
    },

    _unlove: function(mediaDetails, index, successCallback)
    {
        var success = function()
        {
            mediaDetails.loved = false;
            successCallback(index, mediaDetails);

            UserNotifier.getInstance().info("'"+mediaDetails.artist.name+" - "+mediaDetails.title+"' has been unloved.");
        };

        this.innerModifier.unLove(
            mediaDetails,
            {
                success: success,
                error: function(){}
            });
    }
};

