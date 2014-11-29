window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderService = function(playlistService, factory)
{
    this.playlisService = playlistService;
    this.loaderFactory = factory;
};

window.Playlist.PlaylistLoaderService.prototype =
{
    _handlePlaylistLoaded: function(playlist)
    {
        this.playlisService.addToPlaylist(playlist);
    },

    loadPlaylist: function(value)
    {
        this.loaderFactory.create(value).loadPlaylist(value, $.proxy(this._handlePlaylistLoaded, this));
    }
};