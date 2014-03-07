//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function()
{
    this.playlist = new window.Player.Playlist();
    //TODO remove this field it is redundant
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
        Logger.getInstance().Info("Playlist has been cleared. "+ this.playlist.length() +" items removed.");
        this.playlist = new window.Player.Playlist();
        EventBroker.getInstance().fireEvent(window.Player.PlaylistEvents.PlaylistCleared);

        this._updatePlaylist();
    },

    restorePlaylist: function()
    {
        var storedData = LocalStorage.getInstance().getData("tempPl");
        var playlist = new window.Player.Playlist();
        if(storedData.mediaList.length > 0)
        {
            playlist.deserialize(storedData.mediaList);
            this.playlist = playlist;
            Logger.getInstance().Info("Playlist has been restored with "+playlist.length()+" elements.");
            EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated, playlist.length());
        }
    },

    savePlaylist: function()
    {
        LocalStorage.getInstance().setData("tempPl", this.playlist);
        Logger.getInstance().Info("Playlist has been saved with "+this.playlist.length()+" elements.");
    },

    //adds new playlist (or single media) to existing playlist.
    addToPlaylist: function(playlist)
    {
        if(this.playlist.length() == 0)
        {
            EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistCreated, playlist.length());
        }
        //TODO: consider moving this loop to playlist implementation
        for(var i=0;i<playlist.length();i++)
        {
            this.playlist.addItem(playlist.get(i));
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
        var currentItem = this.playlist.currentItemIndex;
        this.playlist.remove(index);
        Logger.getInstance().Debug("Element has been removed from playlist, now it contains "+this.playlist.length()+" elements.");
        this._eventBroker.fireEventWithData(
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
    }
};
