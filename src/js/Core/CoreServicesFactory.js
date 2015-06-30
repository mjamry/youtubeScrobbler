//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};

window.ApplicationCore.CoreServicesFactory = function()
{
    this._sessionProvider = null;
    this._googleApiWrapper = null;

    this._currentPlaylistStateName = "sc_currentPlaylistState";
    this._changelogFilePath = "../CHANGELOG.html";
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

    createPlaylistService: function(repositoryService, playlistElementDetailsProvider)
    {
        var initialPlaylist = new window.Playlist.PersistentPlaylist(repositoryService, window.Playlist.PlaylistRepositoryNames.Local, this._currentPlaylistStateName);
        return new window.Services.PlaylistService(playlistElementDetailsProvider, initialPlaylist);
    },

    createPlaylistRepositoryService: function()
    {
        var repos = {};
        repos[window.Playlist.PlaylistRepositoryNames.Local] = new window.Playlist.PlaylistLocalRepository(this._currentPlaylistStateName);
        //TODO: add api instead of null value
        repos[window.Playlist.PlaylistRepositoryNames.Youtube] = new window.Playlist.PlaylistYoutubeRepository(null);

        return new window.Services.PlaylistRepositoryService(repos, this._currentPlaylistStateName);
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

        return new window.Services.PlaylistLoaderService(playlistService, playlistLoadersFactory);
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
    },

    createPlaylistManagementService: function(playlistRepoService, playlistService)
    {
        return new window.Services.PlaylistManagementService(playlistRepoService, playlistService);
    },

    createChangelogService: function()
    {
        return new window.Services.ChangelogService(this._changelogFilePath);
    }
};

