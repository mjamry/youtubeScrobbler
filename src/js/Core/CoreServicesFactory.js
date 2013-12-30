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
    _getSessionProvider: function()
    {
        if(!this._sessionProvider)
        {
            var factory = new window.LastFm.LastFmApiFactory();
            this._sessionProvider = factory.createSessionProvider();
        }

        return this._sessionProvider;
    },

    createBrokerHandler: function()
    {
        return new window.Common.EventBrokerImpl();
    },

    createLoggerService: function()
    {
        return new LoggerImpl();
    },

    createOnlineScrobbler: function()
    {
        return new window.ApplicationCore.OnlineScrobbler(this._getSessionProvider());
    },

    createCookieHandler: function()
    {
        return new window.Common.CookieHandler();
    },

    createSessionHandler: function()
    {
        return new window.ApplicationCore.SessionHandler(this._getSessionProvider());
    },

    createMediaPlayer: function(container)
    {
        return new window.Player.MediaPlayer(window.Player.MediaPlayerConfig, container);
    },

    createPlaylistService: function(player)
    {
        return new window.Player.PlaylistService(player);
    },

    createPlaybackDetailsService: function()
    {
        return new window.Player.PlaybackDetailsService();
    },

    createPlaybackControlService: function(player, playlistController)
    {
        return new window.Player.PlaybackControlService(player, playlistController);
    }
};

