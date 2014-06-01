window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderService = function(playlistService)
{
    this.playlisService = playlistService;
    this.factory = new window.Playlist.PlaylistLoadersFactory();
};

window.Playlist.PlaylistLoaderService.prototype =
{
    _handlePlaylistLoaded: function(playlist)
    {
        this.playlisService.addToPlaylist(playlist);
    },

    loadPlaylist: function(url)
    {
        this.factory.create(url).loadPlaylist(url, $.proxy(this._handlePlaylistLoaded, this));
    }
};