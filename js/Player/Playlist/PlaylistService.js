//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};


window.Player.PlaylistService = function(player, loveStateSwitch)
{
    this.player = player;
    this._loveStateSwitch = loveStateSwitch;
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
        this._eventBroker.addListener(window.LastFm.Events.TrackUnloved, this._handleUnLoved, null, this);
        this._eventBroker.addListener(window.LastFm.Events.TrackLoved, this._handleLoved, null, this);
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
