window.Player = window.Player || {};

window.Player.PlayerServicesFactory = function(){};

window.Player.PlayerServicesFactory.prototype =
{
    createPlaylistElementDetailsProvider: function()
    {
        var factory = new window.LastFm.LastFmApiFactory();
        return new window.Player.PlaylistElementDetailsProvider(factory.createInformationProvider());
    },

    createPlaylistElementLoveStateModifier: function(playlistService)
    {
        var factory = new window.LastFm.LastFmApiFactory();
        return new window.Playlist.PlaylistElementLoveStateModifier(factory.createTrackLoveStateModifier(), playlistService);
    },

    createPlaylistFlowController: function(playlistService)
    {
        return new window.Playlist.PlaylistFlowController(playlistService);
    }
};
