//namespace
window.Player = window.Player || {};

window.Player.PlaybackControlService = function(player, playlistController)
{
    this.player = player;
    this.playlistController = playlistController;
    this.playbackControlAllowed = false;
};

window.Player.PlaybackControlService.prototype =
{
    _notifyUserAboutLoadedMedia: function(mediaDetails)
    {
        var notificationTitle = mediaDetails.artist.name + " - " +mediaDetails.title;
        var notificationBody = mediaDetails.album.name;
        DesktopNotification.getInstance().show(notificationTitle, notificationBody, mediaDetails.album.cover);
    },

    _loadMedia: function(mediaDetails)
    {
        this.player.load(mediaDetails);
        this._notifyUserAboutLoadedMedia(mediaDetails);
        if(this._autoplay)
        {
            this.player.play();
        }
    },

    _handleMediaStopped: function()
    {
        //if track is stopped it means that is has been finished - so lets play next one.
        this.playNext();
    },

    _handlePlaylistItemRemoved: function(eventArgs)
    {
        if(eventArgs.index === this.playlistController.getCurrentItemIndex())
        {
            this.playSpecific(eventArgs.index);
        }
    },

    _handlePlaylistCreated: function()
    {
        this.playbackControlAllowed = true;
        EventBroker.getInstance().fireEvent(window.UI.Events.EnableControlButtonsRequested);
    },

    _handlePlaylistCleared: function()
    {
        this.playbackControlAllowed = false;
        EventBroker.getInstance().fireEvent(window.UI.Events.DisableControlButtonsRequested);
    },

    initialise: function()
    {
        //bind to player events
        EventBroker.getInstance().addListener(window.Player.Events.MediaStopped, this._handleMediaStopped, null, this);
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemRemoved, this._handlePlaylistItemRemoved, null, this);

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, $.proxy(this._handlePlaylistCreated, this));
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCleared, $.proxy(this._handlePlaylistCleared, this));
    },

    //plays current track
    play: function()
    {
        if(this.playbackControlAllowed)
        {
            this.player.play();
        }
    },

    //pauses current track
    pause: function()
    {
        if(this.playbackControlAllowed)
        {
            this.player.pause();
        }
    },

    //plays next media item from playlist
    playNext: function()
    {
        if(this.playbackControlAllowed)
        {
            var nextItem = this.playlistController.getNext();
            this._loadMedia(nextItem);
        }
    },

    //plays previous media item from playlist
    playPrevious: function()
    {
        if(this.playbackControlAllowed)
        {
            var previousItem = this.playlistController.getPrevious();
            this._loadMedia(previousItem);
        }
    },

    //plays item with given index from playlist
    playSpecific: function(index)
    {
        var item = this.playlistController.getSpecific(index);
        if(item !== null)
        {
            this._loadMedia(item);
        }
    },

    //changes order of elements in playlist
    shuffle: function()
    {
        if(this.playbackControlAllowed)
        {
            this.playlistController.shuffle();
            this._updatePlaylist(this.playlistController);
        }
    },

    //gets track details used passed index
    getTrackDetails: function(index)
    {
        return this.playlistController.getSpecific(index);
    },

    //progress as a percentage value
    setPlaybackProgress: function(progressValue)
    {
        this.player.setPlaybackProgress(progressValue);
    }
};

