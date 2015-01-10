window.Playlist = window.Playlist || {};

window.Playlist.PlaylistDetailsProvider = function(playlistControl, playlistService)
{
    this.playlistControl = playlistControl;
    this.playlistService = playlistService;
};

window.Playlist.PlaylistDetailsProvider.prototype =
{
    getCurrentItemIndex: function()
    {
        return this.playlistControl.getCurrentItemIndex();
    },

    getCurrentItemDetails: function()
    {
        var index = this.playlistControl.getCurrentItemIndex();
        return this.getItemDetails(index);
    },

    getItemDetails: function(index)
    {
        return this.playlistService.getPlaylist().get(index);
    }
};