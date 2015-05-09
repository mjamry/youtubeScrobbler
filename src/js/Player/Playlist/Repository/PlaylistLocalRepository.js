window.Playlist = window.Playlist || {};

///Local repository to store playlists.
///It is basing on local storage - browser's cache.
window.Playlist.PlaylistLocalRepository = function()
{
    this.playlistStorageName = "playlists";
    this.storageName = "Local";
};

window.Playlist.PlaylistLocalRepository.prototype =
{
    _storeData: function(name, data)
    {
        var storedData = this._getData();
        if(storedData === null)
        {
            storedData = {};
        }

        var playlistDetails = storedData[name];
        if(!playlistDetails)
        {
            playlistDetails = new window.Playlist.PlaylistDetails();
            playlistDetails.name = name;
        }

        playlistDetails.playlist = data;
        storedData[name] = playlistDetails;

        LocalStorage.getInstance().setData(this.playlistStorageName, storedData);
    },

    //returns window.Playlist.PlaylistDetails
    _getData: function()
    {
        return LocalStorage.getInstance().getData(this.playlistStorageName);
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

    save: function(name, playlist)
    {
        this._storeData(name, playlist);
    }
};