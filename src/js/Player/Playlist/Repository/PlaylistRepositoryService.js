//namepasce
window.Playlist = window.Playlist || {};

///It is a container/wrapper for playlist repository.
///It can use different types of storage - depending on passed data provider.
///Responsibility is to pass queries to inner data provider and be an access point to playlist data.
window.Playlist.PlaylistRepository = function(repository)
{
    this.innerRepository = repository;
};

window.Playlist.PlaylistRepository.prototype =
{
    load: function(id)
    {
        return this.innerRepository.load(id);
    },

    save: function(id, data)
    {
        this.innerRepository.save(id, data);
    },

    delete: function(id)
    {

    }
};