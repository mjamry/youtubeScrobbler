window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderService = function(){};

window.Playlist.PlaylistLoaderService.prototype =
{
    loadPlaylist: function(url)
    {
        var factory = new window.Playlist.PlaylistLoadersFactory();
        return factory.create(url).loadPlaylist(url);
    }
};