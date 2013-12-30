//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function(player)
{
    this.player = player;
    this.playlist = playlist || new window.Player.Playlist();
    this._eventBroker = EventBroker.getInstance();
    //TODO: for future purposes - will be configurable
    this._autoplay = true;

    Logger.getInstance().Info("Playlist service has been created.");
};

window.Player.PlaylistService.prototype =
{
    _updatePlaylist: function(numberOfNewItems)
    {
        numberOfNewItems = numberOfNewItems || 0;
        this._eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistUpdated, numberOfNewItems);
    },

    refreshPlaylist: function()
    {
        this._updatePlaylist();
    },

    //TOOD it should be deleted
    //initialises playlist object, or overwrite existing one.
    createPlaylist: function(playlist)
    {
        this.playlist = playlist;
        Logger.getInstance().Info("New playlist has been created, it contains "+ this.playlist.length() +" elements.");
        this._updatePlaylist(this.playlist.length());
    },

    //creates new empty playlist replacing existing one.
    clearPlaylist: function()
    {
        Logger.getInstance().Info("Playlist has been cleared. "+ this.playlist.length() +" items removed.");
        this.playlist = new window.Player.Playlist();

        this._updatePlaylist();
    },

    //adds new playlist (or single media) to existing playlist.
    addToPlaylist: function(playlist)
    {
        //TODO: consider moving this loop to playlist implementation
        for(var i=0;i<playlist.length();i++)
        {
            this.playlist.add(playlist.get(i));
        }

        Logger.getInstance().Info(playlist.length()+" new element(s) has been added to current playlist. It has now "+this.playlist.length()+" elements.");

        this._updatePlaylist(playlist.length());
    },

    updateItem: function(index, updatedMediaDetails)
    {
        var item = this.playlist.get(index);
        //overwrite some of properties
        updatedMediaDetails.url = item.url;
        updatedMediaDetails.mediaType = item.mediaType;
        updatedMediaDetails.duration = item.duration;

        this.playlist.replace(index, updatedMediaDetails);

        this._eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistItemUpdated,
            {
                mediaDetails: updatedMediaDetails,
                index: index
            }
        );
    },

    removeItem: function(index)
    {
        this.playlist.remove(index);
        Logger.getInstance().Debug("Element has been removed from playlist, now it contains "+this.playlist.length()+" elements.");
        this._updatePlaylist();
    },

    getPlaylist: function()
    {
        //TODO return playlistController instead of playlist - so playlist can be modified only by this service
        return this.playlist;
    }
};
