//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};

window.ApplicationCore.CoreServicesFactory = function()
{
    this._sessionProvider = null;
};

window.ApplicationCore.CoreServicesFactory.prototype =
{
    createBrokerHandler: function()
    {
        return new window.Common.EventBrokerImpl();
    },

    createLoggerService: function()
    {
        return new LoggerImpl();
    },

    createOnlineScrobbler: function(sessionProvider)
    {
        return new window.ApplicationCore.OnlineScrobbler(sessionProvider);
    },

    createCookieHandler: function()
    {
        return new window.Common.CookieImpl();
    },

    createSessionHandler: function()
    {
        var factory = new window.LastFm.LastFmApiFactory();
        return new window.ApplicationCore.SessionHandler(factory.createSessionProvider());
    },

    createMediaPlayer: function(container)
    {
        return new window.Player.MediaPlayer(window.Player.MediaPlayerConfig, container);
    },

    createPlaylistService: function()
    {
        //TODO - use real name for playlist, and store it in config
        var lastPlaylist = LocalStorage.getInstance().getData("tempPl");
        return new window.Player.PlaylistService(lastPlaylist);
    },

    createPlaybackDetailsService: function(player)
    {
        return new window.Player.PlaybackDetailsService(player);
    },

    createPlaybackControlService: function(player, playlistController)
    {
        return new window.Player.PlaybackControlService(player, playlistController);
    }
};

