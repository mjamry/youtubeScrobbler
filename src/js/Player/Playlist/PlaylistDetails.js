window.Playlist = window.Playlist || {};

window.Playlist.PlaylistDetails = function(){};

window.Playlist.PlaylistDetails.prototype =
{
    id: null,
    name: null,
    description: "",
    count: "",
    storageType: "",
    tags: [],
    playlist: new window.Player.Playlist(),

    isAlreadySaved: false,

    deserialize: function(data)
    {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description || "";
        this.count = data.count;
        this.storageType = data.storageType;
        this.tags = data.tags || [];
        this.playlist = data.playlist || new window.Player.Playlist();
    }
};