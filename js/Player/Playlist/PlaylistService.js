//namespace
window.Player = window.Player || {};

window.Player.PlaylistService = function(player, playlist)
{
    this.player = player;
    this.playlist = playlist || {};
};

window.Player.PlaylistService.prototype =
{
    //initialises playlist object, or overwrite existing one.
    setUpPlaylist: function(playlist)
    {
        this.playlist = playlist;
    },

    //plays next media item from playlist
    playNext: function()
    {
        var nextItem = this.playlist.next();
        this.player.load(nextItem);
        this.player.play();
    },

    //plays previous media item from playlist
    playPrevious: function()
    {
        var previousItem = this.playlist.previous();
        this.player.load(previousItem);
        this.player.play();
    },

    //plays item with given index from playlist
    playSpecific: function(index)
    {

    }
}
