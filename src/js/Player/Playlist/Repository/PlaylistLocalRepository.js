window.Playlist = window.Playlist || {};

///Local repository to store playlists.
///It is basing on local storage - browser's cache.
window.Playlist.PlaylistLocalRepository = function(){};

window.Playlist.PlaylistLocalRepository.prototype =
{
    load: function(id)
    {
        var storedData = LocalStorage.getInstance().getData(id);
        var playlist = new window.Player.Playlist();
        if(storedData !== null && storedData.mediaList.length > 0)
        {
            playlist.deserialize(storedData.mediaList);
        }

        return playlist;
    },

    delete: function(id)
    {

    },

    save: function(id, playlist)
    {
        LocalStorage.getInstance().setData(id, playlist);
    }
};