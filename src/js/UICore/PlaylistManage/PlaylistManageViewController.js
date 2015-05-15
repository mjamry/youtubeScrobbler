window.UI = window.UI || {};

window.UI.PlaylistManageViewController = function(config, view, playlistManager)
{
    this.view = view;
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