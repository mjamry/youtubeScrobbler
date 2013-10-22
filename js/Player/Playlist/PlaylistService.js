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

    initialise: function()
    {
        this._eventBroker.addListener(window.Player.Events.MediaStopped, this._handleMediaStopped, null, this);
    },

    //initialises playlist object, or overwrite existing one.
    createPlaylist: function(playlist)
    {
        this.playlist = playlist;
        this._eventBroker.fireEventWithData(window.Player.Events.PlaylistUpdated, this.playlist);
    },

    //adds new playlist (or single media) to existing playlist.
    addToPlaylist: function(playlist)
    {
        //TODO: consider moving this loop to playlist implementation
        for(var i=0;i<playlist.length();i++)
        {
            this.playlist.add(playlist.getItem(i));
        }

        this._eventBroker.fireEventWithData(window.Player.Events.PlaylistUpdated, this.playlist);
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
    }
}
