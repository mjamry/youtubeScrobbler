window.Playlist = window.Playlist || {};

window.Playlist.PlaylistDetailsProvider = function(playlistService)
{
    this.playlistService = playlistService;
};

window.Playlist.PlaylistDetailsProvider.prototype =
{
    getCurrentItemIndex: function()
    {
        return this.playlistService.getPlaylist().currentItemIndex;
    },

    getCurrentItemDetails: function()
    {
        var index = this.getCurrentItemIndex();
        return this.getItemDetails(index);
    },

    getItemDetails: function(index)
    {
        return this.playlistService.getPlaylist().get(index);
    }
};