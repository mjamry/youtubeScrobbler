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
    load: function(id, repository)
    {
        var playlist = this.innerRepository.load(id);

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

    save: function(id, playlist, repository)
    {


        this.innerRepository.save(id, playlist);



        var msg = "Playlist has been saved with "+playlist.length()+" element(s).";
        Logger.getInstance().info(msg);
        UserNotifier.getInstance().info(msg);
    },

    delete: function(id, repository)
    {

    },

    //returns a hash table containing repo name (for UI) and its instance
    availableRepositories: function()
    {
        var exampleRepos = {
            name: "",
            instance: ""
        };

        return exampleRepos;
    },

    //restore

    //TODO: remove it is temporarly only
    clearCurrentPlaylist: function()
    {
        alert("current playlist cleared");
    }
};