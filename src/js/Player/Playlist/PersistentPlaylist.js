window.Playlist = window.Playlist || {};

window.Playlist.PersistentPlaylist = function(repositoryService, storageType, persistentName)
{
    this.innerPlaylist = new window.Player.Playlist();
    this.repository = repositoryService;

    this.persistentPlaylistDetails = new window.Playlist.PlaylistDetails();
    this.persistentPlaylistDetails.name = persistentName;
    this.persistentPlaylistDetails.storageType = storageType;
};

window.Playlist.PersistentPlaylist.prototype =
{
    _saveState: function()
    {
        this.persistentPlaylistDetails.playlist = this.innerPlaylist;
        this.repository.save(this.persistentPlaylistDetails);        
    },
    
    addItem: function(mediaDetails)
    {
        this._saveState();
        this.innerPlaylist.addItem(mediaDetails);
    },

    addPlaylist: function(playlist)
    {
        this._saveState();
        this.innerPlaylist.addPlaylist(playlist);
    },

    insert: function(index, mediaDetails)
    {
        this._saveState();
        this.innerPlaylist.insert(index, mediaDetails);
    },

    remove: function(index)
    {
        this._saveState();
        this.innerPlaylist.remove(index);
    },

    replace: function(index, mediaDetails)
    {
        this._saveState();
        this.innerPlaylist.replace(index, mediaDetails);
    },

    shuffle: function()
    {
        this._saveState();
        this.innerPlaylist.shuffle();
    },

    //non persistent methods
    getCurrentState: function()
    {
        return this.innerPlaylist;
    },

    getStoredState: function()
    {
        return this.repository.load(this.persistentPlaylistDetails);
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