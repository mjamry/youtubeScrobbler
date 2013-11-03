//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function(player, playlist)
{
    this.player = player;
    this.playlist = playlist || new window.Player.Playlist();
    this._eventBroker = window.Common.EventBrokerSingleton.instance();
    //TODO: for future purposes - will be configurable
    this._autoplay = true;

    window.Common.Log.Instance().Info("Playlist service has been created.");
};

window.Player.PlaylistService.prototype =
{
    _handleMediaStopped: function()
    {
        this.playNext();
    },

    _loadMedia: function(mediaDetails)
    {
        this.player.load(mediaDetails);
        if(this._autoplay)
        {
            this.player.play();
        }
    },

    _updatePlaylist: function(playlist)
    {
        this.playlist = playlist;
        this._eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistUpdated, this.playlist);
    },

    _handleItemRemoved: function(index)
    {
        var tempPlaylist = this.playlist;
        tempPlaylist.remove(index);
        window.Common.Log.Instance().Debug("Element has been removed from playlist, now it contains "+tempPlaylist.length()+" elements.");
        this._updatePlaylist(tempPlaylist);
    },

    initialise: function()
    {
        this._eventBroker.addListener(window.Player.Events.MediaStopped, this._handleMediaStopped, null, this);
        this._eventBroker.addListener(window.Player.PlaylistEvents.PlaylistRemoveItemRequested, this._handleItemRemoved, null, this);
    },

    //initialises playlist object, or overwrite existing one.
    createPlaylist: function(playlist)
    {
        window.Common.Log.Instance().Info("New playlist has been created, it contains "+playlist.length()+" elements.");
        this._updatePlaylist(playlist);
    },

    //adds new playlist (or single media) to existing playlist.
    addToPlaylist: function(playlist)
    {
        var tempPlaylist = this.playlist;
        //TODO: consider moving this loop to playlist implementation
        for(var i=0;i<playlist.length();i++)
        {
            tempPlaylist.add(playlist.getItem(i));
        }

        window.Common.Log.Instance().Info(playlist.length()+" new element(s) has been added to current playlist. It has now "+tempPlaylist.length()+" elements.");

        this._updatePlaylist(tempPlaylist);
    },

    //plays next media item from playlist
    playNext: function()
    {
        var nextItem = this.playlist.next();
        this._loadMedia(nextItem);
    },

    //plays previous media item from playlist
    playPrevious: function()
    {
        var previousItem = this.playlist.previous();
        this._loadMedia(previousItem);
    },

    //plays item with given index from playlist
    playSpecific: function(index)
    {
        var item = this.playlist.getItem(index);
        if(item != null)
        {
            this._loadMedia(item);
        }
    },

    //gets track details used passed index
    getTrackDetails: function(index)
    {
        return this.playlist.getItem(index);
    }
};
