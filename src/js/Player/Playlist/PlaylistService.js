//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function(playlistRepo)
{
    this.playlist = new window.Playlist.PersistentPlaylist(playlistRepo);
    this.playlistRepository = new window.Playlist.PlaylistRepository(playlistRepo);
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
        this.loadPlaylist();
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
        UserNotifier.getInstance().info(msg, $.proxy(
            function()
            {
                var storedPlaylist = this.playlist.getStoredState();
                this.playlist.set(storedPlaylist);
                EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated, this.playlist.length());
            },
            this));

        this.playlist.set(new window.Player.Playlist());
        EventBroker.getInstance().fireEvent(window.Player.PlaylistEvents.PlaylistCleared);

        this._updatePlaylist();
    },

    loadPlaylist: function()
    {
        this.playlist.set(this.playlistRepository.load("tempPl"));
        var msg = "";
        if(!this.playlist.isEmpty())
        {
            EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated, this.playlist.length());
            msg = this.playlist.length() + " item(s) have been read and added to the playlist.";
        }
        else
        {
            msg = "There is no playlist saved. Please create a new one.";
        }

        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);
    },

    savePlaylist: function()
    {
        this.playlistRepository.save("tempPl", this.playlist.getCurrentState());

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

    insertIntoPlaylist: function(index, details)
    {
        this.playlist.insert(index, details);

        var msg = "New item have been successfully added to the playlist, on position: "+(index+1);
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);

        this._updatePlaylist(0);
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
        UserNotifier.getInstance().info(msg, $.proxy(function()
        {
            this.insertIntoPlaylist(index, mediaDetails);
        }, this));
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
        return this.playlist.getCurrentState();
    },

    getCurrentItemDetails: function()
    {
        var index = this.playlist.getCurrentState().currentItemIndex;
        return this.playlist.get(index);
    }
};
