window.Playlist = window.Playlist || {};

///Local repository to store playlists.
///It is basing on local storage - browser's cache.
window.Playlist.PlaylistLocalRepository = function(){};

window.Playlist.PlaylistLocalRepository.prototype =
{
    load: function(name)
    {
        var storedData = LocalStorage.getInstance().getData("tempPl");
        var playlist = new window.Player.Playlist();
        if(storedData !== null && storedData.mediaList.length > 0)
        {
            playlist.deserialize(storedData.mediaList);
            this.playlist = playlist;
        }

        return playlist;
    },

    save: function(name)
    {
        LocalStorage.getInstance().setData("tempPl", this.playlist);
    }
};