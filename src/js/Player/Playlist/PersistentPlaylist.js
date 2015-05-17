window.Playlist = window.Playlist || {};

window.Playlist.PersistentPlaylist = function(repositoryService, storageType, persistentName)
{
    this.repository = repositoryService;

    this.persistentPlaylistDetails = new window.Playlist.PlaylistDetails();
    this.persistentPlaylistDetails.name = persistentName;
    this.persistentPlaylistDetails.storageType = storageType;
};

window.Playlist.PersistentPlaylist.prototype =
{
    _saveState: function()
    {
        this.repository.save(this.persistentPlaylistDetails);
    },
    
    addItem: function(mediaDetails)
    {
        this.persistentPlaylistDetails.playlist.addItem(mediaDetails);
        this._saveState();
    },

    addPlaylist: function(playlist)
    {

        this.persistentPlaylistDetails.playlist.addPlaylist(playlist);
        this._saveState();
    },

    insert: function(index, mediaDetails)
    {
        this.persistentPlaylistDetails.playlist.insert(index, mediaDetails);
        this._saveState();
    },

    remove: function(index)
    {
        this.persistentPlaylistDetails.playlist.remove(index);
        this._saveState();
    },

    replace: function(index, mediaDetails)
    {
        this.persistentPlaylistDetails.playlist.replace(index, mediaDetails);
        this._saveState();
    },

    shuffle: function()
    {
        this.persistentPlaylistDetails.playlist.shuffle();
        this._saveState();
    },

    //non persistent methods
    getCurrentState: function()
    {
        return this.persistentPlaylistDetails.playlist;
    },

    getStoredState: function()
    {
        return this.repository.load(this.persistentPlaylistDetails);
    },

    set: function(playlist)
    {
        this.persistentPlaylistDetails.playlist = playlist;
        this._saveState();
    },

    get: function(index)
    {
        return this.persistentPlaylistDetails.playlist.get(index);
    },

    first: function()
    {
        return this.persistentPlaylistDetails.playlist.first();
    },

    last: function()
    {
        return this.persistentPlaylistDetails.playlist.last();
    },

    length: function()
    {
        return this.persistentPlaylistDetails.playlist.length();
    },

    isEmpty: function()
    {
        return this.persistentPlaylistDetails.playlist.isEmpty();
    }
};