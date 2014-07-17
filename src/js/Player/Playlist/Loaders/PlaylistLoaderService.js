window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderService = function(playlistService, searchService)
{
    this.playlisService = playlistService;
    this.loaderFactory = new window.Playlist.PlaylistLoadersFactory();
    this.searchService = searchService;
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