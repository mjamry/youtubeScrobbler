window.UI = window.UI || {};

window.UI.PlaylistManageViewController = function(config, playlistManager)
{
    this.config = config;
    this.playlistManager = playlistManager;
};

window.UI.PlaylistManageViewController.prototype =
{
    initialise: function()
    {
        var playlists = this.playlistManager.loadPlaylistDetailsForAllPlaylists("Local");
    }
};