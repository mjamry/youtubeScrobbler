window.Tests = window.Tests || {};

window.Tests.MockPlaylistRepository = function(){};

window.Tests.MockPlaylistRepository.prototype =
{
    load: function(name)
    {
        //for now does nothing
    },

    save: function(name, playlist)
    {
        //for now does nothing
    }
};