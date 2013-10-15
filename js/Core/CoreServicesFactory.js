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
        var playlistService = new window.Player.PlaylistService(player);
        playlistService.initialise();
        return playlistService;
    }
}

