//namepasce
window.Playlist = window.Playlist || {};

///It is a container/wrapper for playlist repository.
///It can use different types of storage - depending on passed data provider.
///Responsibility is to pass queries to inner data provider and be an access point to playlist data.
window.Playlist.PlaylistRepository = function(dataProvider)
{
    this.dataProvider = dataProvider;
};

window.Playlist.PlaylistRepository.prototype =
{
    load: function(name)
    {
        return this.dataProvider.load(name);
    },

    save: function(name, data)
    {
        this.dataProvider.save(name, data);
    }
};