window.Playlist = window.Playlist || {};

window.Playlist.DefaultPlaylistLoader = function(){};

window.Playlist.DefaultPlaylistLoader.prototype =
{
    loadPlaylist: function(url)
    {
        //for now does nothing - just return empty playlist
        return new window.Player.Playlist();
    }
};