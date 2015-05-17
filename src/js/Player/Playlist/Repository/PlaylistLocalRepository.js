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
        var playlist = new window.Player.Playlist();

        if(storedData !== null && storedData[name])
        {
            playlist.deserialize(storedData[name].playlist.mediaList);
        }

        return playlist;
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

        //var playlistDetails = storedData[name];
        //if(!playlistDetails)
        //{
        //    playlistDetails = new window.Playlist.PlaylistDetails();
        //    playlistDetails.name = name;
        //    playlistDetails.storageType = this.storageName;
        //}
        //
        //playlistDetails.playlist = data;
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
            //deserialize to get appropriate playlist
            var playlist = new window.Player.Playlist();
            playlist.deserialize(storedPlaylists[item].playlist.mediaList);
            storedPlaylists[item].playlist = playlist;

            playlistsDetails.push(storedPlaylists[item]);
        });

        return playlistsDetails;
    },

    getRepoName: function()
    {
        return window.Playlist.PlaylistRepositoryNames.Local;
    }
};