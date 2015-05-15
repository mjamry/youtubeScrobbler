window.Services = window.Services || {};

window.Services.PlaylistLoaderService = function(playlistService, factory)
{
    this.playlisService = playlistService;
    this.loaderFactory = factory;
};

window.Services.PlaylistLoaderService.prototype =
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