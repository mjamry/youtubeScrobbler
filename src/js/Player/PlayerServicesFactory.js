window.Player = window.Player || {};

window.Player.PlayerServicesFactory = function(){};

window.Player.PlayerServicesFactory.prototype =
{
    createPlaylistElementDetailsProvider: function(trackInformationProvider)
    {
        return new window.Player.PlaylistElementDetailsProvider(trackInformationProvider);
    },

    createPlaylistElementLoveStateModifier: function(playlistService, trackLoveStateModifier)
    {
        return new window.Playlist.PlaylistElementLoveStateModifier(trackLoveStateModifier, playlistService);
    },

    createPlaylistFlowController: function(playlistService)
    {
        return new window.Playlist.PlaylistFlowController(playlistService);
    },

    createPlaylistDetailsProvider: function(playlistFlowController, playlistService)
    {
        return new window.Playlist.PlaylistDetailsProvider(playlistFlowController, playlistService);
    }
};
