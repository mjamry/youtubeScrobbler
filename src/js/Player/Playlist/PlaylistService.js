//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function()
{
    this.playlist = new window.Player.Playlist();
    Logger.getInstance().info("Playlist service has been created.");
};

window.Player.PlaylistService.prototype =
{
    _updatePlaylist: function(numberOfNewItems)
    {
        numberOfNewItems = numberOfNewItems || 0;
        EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistUpdated, numberOfNewItems);
    },

    initialise: function()
    {
        this.restorePlaylist();
    },

    refreshPlaylist: function()
    {
        this._updatePlaylist();
    },

    //creates new empty playlist replacing existing one.
    clearPlaylist: function()
    {
        var msg = "Playlist has been cleared. "+ this.playlist.length() +" item(s) removed.";
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg, function(){alert("undo playlist clear");});
        this.playlist = new window.Player.Playlist();
        EventBroker.getInstance().fireEvent(window.Player.PlaylistEvents.PlaylistCleared);

        this._updatePlaylist();
    },

    restorePlaylist: function()
    {
        var storedData = LocalStorage.getInstance().getData("tempPl");
        var playlist = new window.Player.Playlist();
        if(storedData !== null && storedData.mediaList.length > 0)
        {
            playlist.deserialize(storedData.mediaList);
            this.playlist = playlist;

            EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated, playlist.length());
            var msg = playlist.length()+" item(s) have been read and added to the playlist.";
            Logger.getInstance().info(msg);
            UserNotifier.getInstance().info(msg);
        }
    },

    savePlaylist: function()
    {
        LocalStorage.getInstance().setData("tempPl", this.playlist);

        var msg = "Playlist has been saved with "+this.playlist.length()+" element(s).";
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);
    },

    //adds new playlist (or single media) to existing playlist.
    addToPlaylist: function(playlist)
    {
        this.playlist.addPlaylist(playlist);
        //if both playlist's length is equal it means that new playlist was created - so lets fire an event
        if(this.playlist.length() === playlist.length())
        {
            EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated, playlist.length());
        }

        var msg = playlist.length()+" new item(s) have been successfully added to the playlist";
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);

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

        EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistItemUpdated,
            {
                mediaDetails: updatedMediaDetails,
                index: index
            }
        );
    },

    removeItem: function(index)
    {
        var currentItem = this.playlist.currentItemIndex;
        var mediaDetails = this.playlist.get(index);
        this.playlist.remove(index);

        var msg = "'"+mediaDetails.artist.name+" - "+mediaDetails.title+"' has been removed from the playlist.";
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg, function(){alert("undo remove item");});
        EventBroker.getInstance().fireEventWithData(
            window.Player.PlaylistEvents.PlaylistItemRemoved,
            {
                index: index,
                isCurrentlyPlayingItemRemoved: index == currentItem
            }
        );
        this._updatePlaylist();
    },

    getPlaylist: function()
    {
        //TODO return playlistController instead of playlist - so playlist can be modified only by this service
        return this.playlist;
    },

    getCurrentItemDetails: function()
    {
        var index = this.playlist.currentItemIndex;
        return this.playlist.get(index);
    }
};
