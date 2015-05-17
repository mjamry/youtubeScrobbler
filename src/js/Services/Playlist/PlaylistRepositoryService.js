//namepasce
window.Services = window.Services || {};

///It is a container/wrapper for playlist repository.
///It can use different types of storage - depending on passed data provider.
///Responsibility is to pass queries to inner data provider and be an access point to playlist data.
window.Services.PlaylistRepositoryService = function(repository)
{
    this.innerRepository = repository;
};

window.Services.PlaylistRepositoryService.prototype =
{
    load: function(playlistDetails)
    {
        var playlist = this.innerRepository.load(playlistDetails);

        var msg = "";
        if(!playlist.isEmpty())
        {
            //this._onPlaylistCreated();
            msg = playlist.length() + " item(s) have been read and added to the playlist.";
        }
        else
        {
            msg = "There is no playlist saved. Please create a new one.";
        }

        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);
        return playlist;
    },

    save: function(playlistDetails)
    {
        //TODO check playlistDetails.storageType and choose right repository
        this.innerRepository.save(playlistDetails);

        var msg = "Playlist has been saved with "+playlistDetails.playlist.length()+" element(s).";
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);
    },

    delete: function(id, repository)
    {

    },

    //returns a hash table containing repo name (for UI) and its instance
    availableRepositories: function()
    {
        var exampleRepos = [];
        exampleRepos[this.innerRepository.getRepoName()] = this.innerRepository;

        return exampleRepos;
    },

    //restore

    //TODO: remove it is temporarly only
    clearCurrentPlaylist: function()
    {
        alert("current playlist cleared");
    }
};