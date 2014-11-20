//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};

window.ApplicationCore.CoreServicesFactory = function()
{
    this._sessionProvider = null;
    this._googleApiWrapper = null;
};

window.ApplicationCore.CoreServicesFactory.prototype =
{
    _createGoogleApiWrapper: function()
    {
        if(this._googleApiWrapper == null)
        {
            this._googleApiWrapper = new window.Google.GoogleApiWrapper();
        }

        return this._googleApiWrapper;
    },

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

    //deprecated - use createSessionManager
    createSessionHandler: function()
    {
        var factory = new window.LastFm.LastFmApiFactory();
        return new window.ApplicationCore.SessionHandler(factory.createSessionProvider());
    },

    //TODO remove hardcoded session coordinators names
    createSessionService: function()
    {
        var apiWrapper = {};
        apiWrapper[window.Google.ServiceNames.Auth] = this._createGoogleApiWrapper();
        var lastFmTokenHandler = new window.Accounts.LastFmTokenHandler(window.Accounts.LastFmSessionConstants);
        var sessionCoordinators =
        {
            Google: new window.Accounts.GoogleSessionCoordinator(apiWrapper),
            LastFM: new window.Accounts.LastFmSessionCoordinator(LastFmApiCommon.DATA_PROVIDER, lastFmTokenHandler)
        };

        return new window.Accounts.SessionService(sessionCoordinators);
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
        return new window.Player.PlaybackDetailsService(player, player);
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
    },

    createSearchService: function()
    {
        var searchDetailsProviders = {};
        searchDetailsProviders[window.Google.ServiceNames.Youtube] = this._createGoogleApiWrapper();

        return new window.Services.SearchService(searchDetailsProviders);
    }
};

