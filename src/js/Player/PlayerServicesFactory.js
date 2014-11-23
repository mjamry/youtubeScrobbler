window.Player = window.Player || {};

window.Player.PlayerServicesFactory = function(){};

window.Player.PlayerServicesFactory.prototype =
{
    createPlaylistElementDetailsProvider: function(sessionProvider)
    {
        var factory = new window.LastFm.LastFmApiFactory();
        return new window.Player.PlaylistElementDetailsProvider(factory.createInformationProvider());
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
