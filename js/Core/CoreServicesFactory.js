//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};

window.ApplicationCore.CoreServicesFactory = function(){}

window.ApplicationCore.CoreServicesFactory.prototype =
{
    createBrokerHandler: function()
    {
        return new window.Common.EventBroker();
    },

    createLoggerService: function()
    {
        return new Logger();
    },

    createOnlineScrobbler: function()
    {
        return new window.ApplicationCore.OnlineScrobbler();
    },

    createCookieHandler: function()
    {
        return new window.Common.CookieHandler();
    },

    createMediaPlayer: function(container)
    {
        return new window.Player.MediaPlayer(window.Player.MediaPlayerConfig, container);
    },

    createPlaylistService: function(player)
    {
        var lastFmFactory = new window.LastFm.LastFmApiFactory();
        var detailsProvider = new window.Player.PlaylistElementDetailsProvider(lastFmFactory.createInformationProvider());
        var playlistService = new window.Player.PlaylistService(player, detailsProvider);
        playlistService.initialise();
        return playlistService;
    }
}

