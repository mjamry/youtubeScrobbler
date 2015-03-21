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
    createGoogleApiWrapper: function()
    {
        return new window.Google.GoogleApiWrapper();
    },

    createBrokerHandler: function()
    {
        return new window.Common.EventBrokerImpl();
    },

    createLoggerService: function()
    {
        return new LoggerImpl();
    },

    createReportSender: function()
    {
        return new window.Common.ReportSenderImpl();
    },

    createOnlineScrobbler: function(lowLevelScrobbler)
    {
        return new window.ApplicationCore.OnlineScrobbler(lowLevelScrobbler);
    },

    createCookieHandler: function()
    {
        return new window.Common.CookieImpl();
    },

    createSessionService: function(googleApi, lastFmFactory)
    {
        var sessionCoordinators = [];
        sessionCoordinators[window.Accounts.AccountsNames.Google] = new window.Accounts.GoogleSessionCoordinator(googleApi);
        sessionCoordinators[window.Accounts.AccountsNames.LastFM] = lastFmFactory.createSessionCoordinator();

        return new window.Accounts.SessionService(sessionCoordinators);
    },

    createMediaPlayer: function(playlistService)
    {
        return new window.Player.MediaPlayer(window.Player.MediaPlayerConfig, window.UI.UIConstants.PlayerContainer, playlistService);
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

    createPlaylistLoaderService: function(playlistService, dataProvider)
    {
        var dataProvides = [];
        dataProvides[window.Playlist.PlaylistLoaderTypes.Youtube] = dataProvider;
        var playlistLoadersFactory = new window.Playlist.PlaylistLoadersFactory(dataProvides);

        return new window.Playlist.PlaylistLoaderService(playlistService, playlistLoadersFactory);
    },

    createWelcomeService: function()
    {
        return new window.Services.WelcomeScreenService(window.UI.WelcomeScreenConfiguration);
    },

    createSearchService: function(dataProvider)
    {
        var searchDetailsProviders = {};
        searchDetailsProviders[window.Google.ServiceNames.Youtube] = dataProvider;

        return new window.Services.SearchService(searchDetailsProviders);
    }
};

