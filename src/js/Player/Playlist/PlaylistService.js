//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function(playlistRepo, playlistElementDetailsProvider)
{
    this.playlist = new window.Playlist.PersistentPlaylist(playlistRepo);
    this.playlistRepository = new window.Playlist.PlaylistRepository(playlistRepo);
    this.detailsProvider = playlistElementDetailsProvider;
    Logger.getInstance().info("Playlist service has been created.");
};

window.Player.PlaylistService.prototype =
{
    _onPlaylistCreated: function()
    {
        EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated);
    },

    _onPlaylistCleared: function()
    {
        EventBroker.getInstance().fireEvent(window.Player.PlaylistEvents.PlaylistCleared);
    },

    _updatePlaylist: function(newItems)
    {
        var numberOfNewItems = newItems ? newItems.length() : 0;
        EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistUpdated, numberOfNewItems);

        if(numberOfNewItems > 0)
        {
            var firstNewItemIndex = this.playlist.length() - numberOfNewItems;
            this.detailsProvider.obtainDetailsForItems(newItems.toArray(), firstNewItemIndex,  this.updateItem.bind(this));
        }
    },

    _setPlaylist: function(playlist)
    {
        this.playlist.set(playlist);
        if(!playlist.isEmpty())
        {
            this._onPlaylistCreated();
        }
    },

    initialise: function()
    {
        this._setPlaylist(this.playlist.getStoredState());
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
                this._setPlaylist(this.playlist.getStoredState());
            },
            this));

        this._setPlaylist(new window.Player.Playlist());
        this._onPlaylistCleared();
        this._updatePlaylist();
    },

    loadPlaylist: function()
    {
        this.playlist.set(this.playlistRepository.load("tempPl"));
        var msg = "";
        if(!this.playlist.isEmpty())
        {
            this._onPlaylistCreated();
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
            this._onPlaylistCreated();
        }

        var msg = playlist.length()+" new item(s) have been successfully added to the playlist";
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);

        this._updatePlaylist(playlist);
    },

    insertIntoPlaylist: function(index, details)
    {
        var playlistLengthBeforeChange = this.playlist.length();

        this.playlist.insert(index, details);

        if(playlistLengthBeforeChange === 0)
        {
            this._onPlaylistCreated();
        }

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
        var isCurrentlyPlayedItemRemoved = index == this.getPlaylist().currentItemIndex;
        var mediaDetails = this.playlist.get(index);
        this.playlist.remove(index);

        //check if last item from the playlist has been removed
        if(this.playlist.length() === 0)
        {
            this._onPlaylistCleared();
        }

        var msg = "'"+mediaDetails.artist.name+" - "+mediaDetails.title+"' has been removed from the playlist.";
        Logger.getInstance().info(msg);

        UserNotifier.getInstance().info(msg, $.proxy(function()
        {
            this.insertIntoPlaylist(index, mediaDetails);
        }, this));

        EventBroker.getInstance().fireEventWithData(
            window.Player.PlaylistEvents.PlaylistItemRemoved,
            {
                isCurrentlyPlayedItemRemoved: isCurrentlyPlayedItemRemoved,
                index: index
            });

        this._updatePlaylist();
    },

    getPlaylist: function()
    {
        return this.playlist.getCurrentState();
    }
};
