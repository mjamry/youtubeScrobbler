window.Tests = window.Tests || {};

window.Tests.MockPlaylistRepo = function(){};

window.Tests.MockPlaylistRepo.prototype =
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