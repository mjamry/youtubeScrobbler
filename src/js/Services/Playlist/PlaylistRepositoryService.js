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
    load: function(id, repo)
    {
        //TODO select appropriate repository using repo value
        var playlistDetails = this.innerRepository.load(id);

        var msg = "";
        if(!playlistDetails.playlist.isEmpty())
        {
            msg = "Playlist '"+playlistDetails.name+"' loaded. You have now " + playlistDetails.playlist.length() + " tracks in your playlist.";
        }
        else
        {
            msg = "There is no playlist saved. Please create a new one.";
        }

        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);
        return playlistDetails;
    },

    save: function(playlistDetails)
    {
        //TODO check playlistDetails.storageType and choose right repository
        this.innerRepository.save(playlistDetails);
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
    }
};