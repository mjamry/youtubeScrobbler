window.Playlist = window.Playlist || {};

///Local repository to store playlists.
///It is basing on local storage - browser's cache.
window.Playlist.PlaylistLocalRepository = function()
{
    this.playlistStorageName = "playlists";
};

window.Playlist.PlaylistLocalRepository.prototype =
{
    //returns window.Playlist.PlaylistDetails
    _getData: function()
    {
        var data = LocalStorage.getInstance().getData(this.playlistStorageName);
        if(!data)
        {
            data = {};
        }

        return data;
    },

    load: function(name)
    {
        var storedData = this._getData();
        var plDetails = new window.Playlist.PlaylistDetails();

        if(storedData !== null && storedData[name])
        {
            plDetails = storedData[name];
            var playlist = new window.Player.Playlist();
            playlist.deserialize(plDetails.playlist.mediaList);
            plDetails.playlist = playlist;
        }

        return plDetails;
    },

    delete: function(name)
    {

    },

    save: function(playlistDetails)
    {
        var storedData = this._getData();
        if(storedData === null)
        {
            storedData = {};
        }

        storedData[playlistDetails.name] = playlistDetails;
        LocalStorage.getInstance().setData(this.playlistStorageName, storedData);
    },

    getAllPlaylists: function()
    {
        var playlistsDetails = [];
        var storedPlaylists = this._getData();
        var plNames = Object.keys(storedPlaylists);
        plNames.forEach(function(item)
        {
            var plDetails = new window.Playlist.PlaylistDetails();
            plDetails.deserialize(storedPlaylists[item]);

            var playlist = new window.Player.Playlist();
            playlist.deserialize(storedPlaylists[item].playlist.mediaList);
            plDetails.playlist = playlist;

            playlistsDetails.push(plDetails);
        });

        return playlistsDetails;
    },

    getRepoName: function()
    {
        return window.Playlist.PlaylistRepositoryNames.Local;
    }
};