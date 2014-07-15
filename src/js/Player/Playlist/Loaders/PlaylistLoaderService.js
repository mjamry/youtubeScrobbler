window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderService = function(playlistService)
{
    this.playlisService = playlistService;
    this.loaderFactory = new window.Playlist.PlaylistLoadersFactory();
    this.searchService = new window.Playlist.SearchService(new window.Playlist.SearchEngineFactory().create());
};

window.Playlist.PlaylistLoaderService.prototype =
{
    _isUrl: function(value)
    {

    },

    _handlePlaylistLoaded: function(playlist)
    {
        this.playlisService.addToPlaylist(playlist);
    },

    loadPlaylist: function(value)
    {
        if(this._isUrl(value))
        {
            this.loaderFactory.create(value).loadPlaylist(value, $.proxy(this._handlePlaylistLoaded, this));
        }
        else
        {
            this.searchService.search(value);
        }
    }
};