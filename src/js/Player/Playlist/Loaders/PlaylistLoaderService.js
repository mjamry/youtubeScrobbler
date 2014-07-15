window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderService = function(playlistService)
{
    this.playlisService = playlistService;
    this.loaderFactory = new window.Playlist.PlaylistLoadersFactory();
};

window.Playlist.PlaylistLoaderService.prototype =
{
    _isUrl: function(value)
    {
        //todo add some logic checking if passed string value is an url - regex
        return true;
    },

    _handlePlaylistLoaded: function(playlist)
    {
        this.playlisService.addToPlaylist(playlist);
    },

    loadPlaylist: function(url)
    {
        if(this._isUrl(url))
        {
            this.loaderFactory.create(url).loadPlaylist(url, $.proxy(this._handlePlaylistLoaded, this));
        }
        else
        {

        }
    }
};