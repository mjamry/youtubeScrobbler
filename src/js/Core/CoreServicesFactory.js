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

    createMediaPlayer: function(container, playlistService)
    {
        return new window.Player.MediaPlayer(window.Player.MediaPlayerConfig, container, playlistService);
    },

    createPlaylistService: function(playlistElementDetailsProvider)
    {
        var playlistRepo = new window.Playlist.PlaylistLocalRepository();
        return new window.Player.PlaylistService(playlistRepo, playlistElementDetailsProvider);
    },

    createPlaybackDetailsService: function(player)
    {
        return new window.Player.PlaybackDetailsService(player);
    },

    createPlaybackControlService: function(player, playlistController)
    {
        return new window.Player.PlaybackControlService(player, playlistController);
    },

    createUserNotifier: function()
    {
        return new window.Common.UserNotifierImpl();
    },

    createPlaylistLoaderService: function(playlistService)
    {
        return new window.Playlist.PlaylistLoaderService(playlistService);
    },

    createWelcomeService: function()
    {
        return new window.Services.WelcomeScreenService(window.UI.WelcomeScreenConfiguration);
    }
};

