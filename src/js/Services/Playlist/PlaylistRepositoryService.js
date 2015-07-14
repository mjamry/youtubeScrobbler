//namepasce
window.Services = window.Services || {};

///It is a container/wrapper for playlist repository.
///It can use different types of storage - depending on passed data provider.
///Responsibility is to pass queries to inner data provider and be an access point to playlist data.
window.Services.PlaylistRepositoryService = function(repos, currentPlaylistState)
{
    this.repositories = repos;
    this.currentPlaylistStateName = currentPlaylistState;
};

window.Services.PlaylistRepositoryService.prototype =
{
    load: function(id, repo)
    {
        var playlistDetails = this.repositories[repo].load(id);

        var msg = "";
        if(!playlistDetails.playlist.isEmpty())
        {
            if(playlistDetails.name == this.currentPlaylistStateName)
            {
                msg = "Last playlist state has been restored.";
            }
            else
            {
                msg = "Playlist '" + playlistDetails.name + "' loaded. You have now " + playlistDetails.playlist.length() + " tracks in your playlist.";
            }
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
        var repo = this.repositories[playlistDetails.storageType];
        repo.save(playlistDetails);

        //show info only about playlists saved by user
        if(playlistDetails.name != this.currentPlaylistStateName)
        {
            var msg = "Playlist '"+playlistDetails.name+"' has been saved on the "+playlistDetails.storageType+" repository.";
            Logger.getInstance().info(msg);
            UserNotifier.getInstance().info(msg);
        }
    },

    delete: function(id, repository)
    {

    },

    //returns a hash table containing repo name (for UI) and its instance
    availableRepositories: function()
    {
        return this.repositories;
    }
};