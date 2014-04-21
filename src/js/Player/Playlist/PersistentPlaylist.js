window.Playlist = window.Playlist || {};

window.Playlist.PersistentPlaylist = function(storage)
{
    this.innerPlaylist = new window.Player.Playlist();
    this.repository = new window.Playlist.PlaylistRepository(storage);
    this.persistentPlaylistName = "lastPlaylistState";
};

window.Playlist.PersistentPlaylist.prototype =
{
    addItem: function(mediaDetails)
    {
        this.repository.save(this.persistentPlaylistName, this.innerPlaylist);
        this.innerPlaylist.addItem(mediaDetails);
    },

    addPlaylist: function(playlist)
    {
        this.repository.save(this.persistentPlaylistName, this.innerPlaylist);
        this.innerPlaylist.addPlaylist(playlist);
    },

    insert: function(index, mediaDetails)
    {
        this.repository.save(this.persistentPlaylistName, this.innerPlaylist);
        this.innerPlaylist.insert(index, mediaDetails);
    },

    remove: function(index)
    {
        this.repository.save(this.persistentPlaylistName, this.innerPlaylist);
        this.innerPlaylist.remove(index);
    },

    replace: function(index, mediaDetails)
    {
        this.repository.save(this.persistentPlaylistName, this.innerPlaylist);
        this.innerPlaylist.replace(index, mediaDetails);
    },

    shuffle: function()
    {
        this.repository.save(this.persistentPlaylistName, this.innerPlaylist);
        this.innerPlaylist.shuffle();
    },

    //non persistent methods
    getCurrentState: function()
    {
        return this.innerPlaylist;
    },

    getStoredState: function()
    {
        return this.repository.load(this.persistentPlaylistName);
    },

    set: function(playlist)
    {
        this.innerPlaylist = playlist;
    },

    get: function(index)
    {
        return this.innerPlaylist.get(index);
    },

    first: function()
    {
        return this.innerPlaylist.first();
    },

    last: function()
    {
        return this.innerPlaylist.last();
    },

    length: function()
    {
        return this.innerPlaylist.length();
    },

    isEmpty: function()
    {
        return this.innerPlaylist.isEmpty();
    }
};