window.Player = window.Player || {};

window.Player.PlayerServicesFactory = function(){};

window.Player.PlayerServicesFactory.prototype =
{
    createPlaylistElementDetailsProvider: function(playlistService, sessionProvider)
    {
        var factory = new window.LastFm.LastFmApiFactory();
        return new window.Player.PlaylistElementDetailsProvider(playlistService, factory.createInformationProvider(), sessionProvider);
    },

    createPlaylistElementLoveStateModifier: function(sessionProvider, playlistService)
    {
        var factory = new window.LastFm.LastFmApiFactory();
        return new window.Playlist.PlaylistElementLoveStateModifier(factory.createTrackLoveStateModifier(), sessionProvider, playlistService);
    },

    createPlaylistFlowController: function(playlistService)
    {
        return new window.Playlist.PlaylistFlowController(playlistService);
    }
};
