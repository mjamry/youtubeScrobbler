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
    this._eventBroker = EventBroker.getInstance();
    //TODO: for future purposes - will be configurable
    this._autoplay = true;

    Logger.getInstance().Info("Playlist service has been created.");
};

window.Player.PlaylistService.prototype =
{
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

        var item = this.playlist.get(eventArgs.index);
        newItem.url = item.url;
        newItem.mediaType = item.mediaType;
        newItem.duration = item.duration;

        this.playlist.replace(eventArgs.index, newItem);

        this._eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistItemUpdated,
            {
                mediaDetails: newItem,
                index: eventArgs.index
            }
        );
    },

    //TODO this should works in more clever way.
    _handleLoved: function(index)
    {
        var item = this.getTrackDetails(index);
        item.loved = true;

        this._eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistItemUpdated,
            {
                mediaDetails: item,
                index: index
            }
        );
    },

    _handleUnLoved: function(index)
    {
        var item = this.getTrackDetails(index);
        item.loved = false;

        this._eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistItemUpdated,
            {
                mediaDetails: item,
                index: index
            }
        );
    },

    initialise: function()
    {
        this._eventBroker.addListener(window.Player.PlaylistEvents.PlaylistItemUpdateRequested, this._handleItemUpdated, null, this);

        this._eventBroker.addListener(window.LastFm.Events.TrackUnloved, this._handleUnLoved, null, this);
        this._eventBroker.addListener(window.LastFm.Events.TrackLoved, this._handleLoved, null, this);

        this._detailsProvider.initialise();
    },

    //initialises playlist object, or overwrite existing one.
    createPlaylist: function(playlist)
    {
        Logger.getInstance().Info("New playlist has been created, it contains "+playlist.length()+" elements.");
        this._updatePlaylist(playlist, 0);
    },

    //creates new empty playlist replacing existing one.
    clearPlaylist: function()
    {
        Logger.getInstance().Info("Playlist has been cleared. "+ this.playlist.length() +" items removed.");
        this.playlist = new window.Player.Playlist();

        this._updatePlaylist(this.playlist);
    },

    //adds new playlist (or single media) to existing playlist.
    addToPlaylist: function(playlist)
    {
        //TODO here is copied reference not value! to be resolved... :)
        var tempPlaylist = this.playlist;
        //TODO: consider moving this loop to playlist implementation
        for(var i=0;i<playlist.length();i++)
        {
            tempPlaylist.add(playlist.get(i));
        }

        Logger.getInstance().Info(playlist.length()+" new element(s) has been added to current playlist. It has now "+tempPlaylist.length()+" elements.");

        this._updatePlaylist(tempPlaylist, this.playlist.length() - playlist.length());
    },

    removeItem: function(index)
    {
        var tempPlaylist = this.playlist;
        tempPlaylist.remove(index);
        Logger.getInstance().Debug("Element has been removed from playlist, now it contains "+tempPlaylist.length()+" elements.");
        this._updatePlaylist(tempPlaylist);
    },

    changeLoveState: function(index)
    {
        var item = this.getTrackDetails(index);
        this._loveStateSwitch.changeLoveState(item, index);
    },

    getPlaylist: function()
    {
        //TODO return playlistController instead of playlist - so playlist can be modified only by this service
        return this.playlist;
    }
};
