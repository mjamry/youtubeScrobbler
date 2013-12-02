//namespace
window.Player = window.Player || {};

window.Player.PlaybackControlService = function(player, playlistController)
{
    this.player = player;
    this.playlistController = playlistController;
};

window.Player.PlaybackControlService.prototype =
{
    _loadMedia: function(mediaDetails)
    {
        this.player.load(mediaDetails);
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

    initialise: function()
    {
        //bind to player events
        EventBroker.getInstance().addListener(window.Player.Events.MediaStopped, this._handleMediaStopped, null, this);
    },

    //plays current track
    play: function()
    {
        this.player.play();
    },

    //pauses current track
    pause: function()
    {
        this.player.pause();
    },

    //plays next media item from playlist
    playNext: function()
    {
        var nextItem = this.playlistController.getNext();
        this._loadMedia(nextItem);
    },

    //plays previous media item from playlist
    playPrevious: function()
    {
        var previousItem = this.playlistController.getPrevious();
        this._loadMedia(previousItem);
    },

    //plays item with given index from playlist
    playSpecific: function(index)
    {
        var item = this.playlistController.getSpecific(index);
        if(item != null)
        {
            this._loadMedia(item);
        }
    },

    //changes order of elements in playlist
    shuffle: function()
    {
        this.playlistController.shuffle();

        this._updatePlaylist(this.playlistController);
    },

    //gets track details used passed index
    getTrackDetails: function(index)
    {
        return this.playlistController.getSpecific(index);
    }
};

