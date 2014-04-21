window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderService = function(playlistService)
{
    this.playlisService = playlistService;
};

window.Playlist.PlaylistLoaderService.prototype =
{
    _handlePlaylistLoaded: function(playlist)
    {
        this.playlisService.addToPlaylist(playlist);
    },

    loadPlaylist: function(url)
    {
        var factory = new window.Playlist.PlaylistLoadersFactory();
        factory.create(url).loadPlaylist(url, $.proxy(this._handlePlaylistLoaded, this));
    }
};