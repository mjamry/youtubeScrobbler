window.Playlist = window.Playlist || {};

window.Playlist.PlaylistDetails = function(){};

window.Playlist.PlaylistDetails.prototype =
{
    id: "",
    name: "",
    description: "",
    count: "",
    storageType: "",
    tags: "",
    playlist: new window.Player.Playlist()
};