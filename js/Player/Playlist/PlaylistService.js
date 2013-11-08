//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function(player, playlistElementDetailsProvider, loveStateSwitch, playlist)
{
    this.player = player;
    this._detailsProvider = playlistElementDetailsProvider;
    this._loveStateSwitch = loveStateSwitch;
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

    _updatePlaylist: function(playlist, startIndex)
    {
        this.playlist = playlist;
        this._eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistUpdated, this.playlist);
        if(startIndex != null)
        {
            this._detailsProvider.provideDetails(this.playlist, startIndex);
        }
    },

    _handleItemUpdated: function(eventArgs)
    {
        var newItem = eventArgs.details;

        var item = this.playlist.getItem(eventArgs.index);
        newItem.url = item.url;
        newItem.mediaType = item.mediaType;
        newItem.duration = item.duration;

        this.playlist.replace(eventArgs.index, newItem);

        this._updatePlaylist(this.playlist);
    },

    initialise: function()
    {
        this._eventBroker.addListener(window.Player.Events.MediaStopped, this._handleMediaStopped, null, this);
        this._eventBroker.addListener(window.Player.PlaylistEvents.PlaylistItemUpdateRequested, this._handleItemUpdated, null, this);

        this._detailsProvider.initialise();
    },

    //initialises playlist object, or overwrite existing one.
    createPlaylist: function(playlist)
    {
        window.Common.Log.Instance().Info("New playlist has been created, it contains "+playlist.length()+" elements.");
        this._updatePlaylist(playlist, 0);
    },

    //adds new playlist (or single media) to existing playlist.
    addToPlaylist: function(playlist)
    {
        //TODO here is copied reference not value! to be resolved... :)
        var tempPlaylist = this.playlist;
        //TODO: consider moving this loop to playlist implementation
        for(var i=0;i<playlist.length();i++)
        {
            tempPlaylist.add(playlist.getItem(i));
        }

        window.Common.Log.Instance().Info(playlist.length()+" new element(s) has been added to current playlist. It has now "+tempPlaylist.length()+" elements.");

        this._updatePlaylist(tempPlaylist, this.playlist.length() - playlist.length());
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
    },

    removeItem: function(index)
    {
        var tempPlaylist = this.playlist;
        tempPlaylist.remove(index);
        window.Common.Log.Instance().Debug("Element has been removed from playlist, now it contains "+tempPlaylist.length()+" elements.");
        this._updatePlaylist(tempPlaylist);
    },

    changeLoveState: function(index)
    {
        var item = this.getTrackDetails(index);
        this._loveStateSwitch.changeLoveState(item);
    }
};
