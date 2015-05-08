//namepasce
window.Playlist = window.Playlist || {};

///It is a container/wrapper for playlist repository.
///It can use different types of storage - depending on passed data provider.
///Responsibility is to pass queries to inner data provider and be an access point to playlist data.
window.Playlist.PlaylistRepositoryService = function(repository)
{
    this.innerRepository = repository;
};

window.Playlist.PlaylistRepositoryService.prototype =
{
    load: function(id, repository)
    {
        return this.innerRepository.load(id);
    },

    save: function(id, data, repository)
    {
        this.innerRepository.save(id, data);
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
    }
};