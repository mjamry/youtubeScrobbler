//namespace
window.Services = window.Services || {};

//using
window.Common = window.Common || {};


window.Services.PlaylistService = function(playlistElementDetailsProvider, initialPlaylist)
{
    this.playlist = initialPlaylist;
    this.currentPlaylistDetails = new window.Playlist.PlaylistDetails();
    this.detailsProvider = playlistElementDetailsProvider;
    Logger.getInstance().info("Playlist service has been created.");
};

window.Services.PlaylistService.prototype =
{
    _onPlaylistCreated: function()
    {
        //new playlist has been created
        this.currentPlaylistDetails = new window.Playlist.PlaylistDetails();
        EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated);
    },

    _onPlaylistCleared: function()
    {
        EventBroker.getInstance().fireEvent(window.Player.PlaylistEvents.PlaylistCleared);
    },

    _onPlaylistSaved: function(playlistDetails)
    {
        this.currentPlaylistDetails = playlistDetails;
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
        var wasPreviousPlaylistEmpty = this.playlist.isEmpty();
        this.playlist.set(playlist);
        if(wasPreviousPlaylistEmpty && !playlist.isEmpty())
        {
            this._onPlaylistCreated();
        }
        else
        {
            this._updatePlaylist();
        }
    },

    _clearPlaylist: function()
    {
        this._setPlaylist(new window.Player.Playlist());
    },

    setPlaylist: function(playlistDetails)
    {
        if(!this.currentPlaylistDetails.isAlreadySaved)
        {
            //TODO: ask user if is sure to clear unsaved playlist
            Logger.getInstance().info("Current playlist has not been saved yet.");
        }

        this._clearPlaylist();
        this.currentPlaylistDetails = playlistDetails;
        this._setPlaylist(this.currentPlaylistDetails.playlist);
    },

    initialise: function()
    {
        this._setPlaylist(this.playlist.getStoredState().playlist);

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistSaved, this._onPlaylistSaved.bind(this));
    },

    refreshPlaylist: function()
    {
        this._updatePlaylist();
    },

    //creates new empty playlist replacing existing one.
    clearPlaylist: function()
    {
        var playlistToRestore = this.playlist.getCurrentState();
        var msg = "Playlist has been cleared. "+ this.playlist.length() +" item(s) removed.";
        Logger.getInstance().info(msg);

        var undoFunction = function(that, plToRestore)
        {
            return function()
            {
                that._setPlaylist(plToRestore);
            }
        };

        UserNotifier.getInstance().info(msg, undoFunction(this, playlistToRestore));

        this._clearPlaylist();
        this._onPlaylistCleared();
        this._updatePlaylist();
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

        var msg = playlist.length()+" new item(s) have been successfully added to the playlist.";
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

        var msg = "Item '"+details.artist.name+" - "+details.title+"' have been successfully added to the playlist.";
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
    },

    getPlaylistDetails: function()
    {
        //updates playlist first
        this.currentPlaylistDetails.playlist = this.getPlaylist();
        return this.currentPlaylistDetails;
    }
};
