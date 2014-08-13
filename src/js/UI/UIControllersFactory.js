//namespace
window.UI = window.UI || {};

window.UI.UIControllersFactory = function(){};

window.UI.UIControllersFactoryConfig =
{
    LoggerView: "#logger-content",
    PlaylistView: "#playlist-container",
    PlaylistControlView: "#playlist-control",
    PlaybackProgressView: "#playback-progress-container",
    PlaybackControlView: "#playback-control",
    UserNotificationView: "#user-notifications-container",
    ProgressbarView: "#progressbar-container",
    WelcomeScreenView: "#page"
};

window.UI.UIControllersFactory.prototype =
{
    createUICore: function()
    {
        return new window.UI.UICore();
    },

    createLoggerViewController: function()
    {
        return new window.UI.LoggerViewController($(window.UI.UIControllersFactoryConfig.LoggerView), window.UI.LoggerUIConfig);
    },

    createTestReportViewController: function()
    {
        var reportSender = new window.UI.ReportSender();
        reportSender.initialise();
        return new window.UI.TestReportsViewController(reportSender, window.UI.TestReportUIConfig);
    },

    createPlaylistViewController: function(playlistService, playbackControlService, playlistFlowController)
    {
        return new window.UI.PlaylistViewController(playlistService, playbackControlService, playlistFlowController, $(window.UI.UIControllersFactoryConfig.PlaylistView), window.UI.PlaylistUIConfig);
    },

    createPlaybackDetailsViewController: function(model)
    {
        return new window.UI.PlaybackDetailsViewController(model, $(window.UI.UIControllersFactoryConfig.PlaybackProgressView), window.UI.PLaybackDetailsViewConfiguration);
    },

    createPlaybackControlViewController: function(player, playbackControlService)
    {
        var volumeControlService = new window.Player.VolumeControlService(player);

        var fullScreenContainer = document.getElementById(window.UI.PlaybackControlConfiguration.FullScreenContainer);
        var sizeControlService = new window.Player.VideoSizeControlService(player, fullScreenContainer, window.Player.MediaPlayerConfig);
        sizeControlService.initialise();
        return new window.UI.PlaybackControlViewController(playbackControlService, volumeControlService, sizeControlService, $(window.UI.UIControllersFactoryConfig.PlaybackControlView), window.UI.PlaybackControlConfiguration);
    },

    createPlaylistControlViewController: function(playlistService, playlistFlowController, loveStateModifier)
    {
        return new window.UI.PlaylistControlViewController(playlistService, playlistFlowController, loveStateModifier, $(window.UI.UIControllersFactoryConfig.PlaylistControlView), window.UI.PlaylistControlConfiguration);
    },

    createSessionViewController: function(sessionHandler)
    {
        return new window.UI.SessionViewController(sessionHandler, window.UI.SessionUIConfiguration);
    },

    createMediaLoadViewController: function(playlistLoaderService, searchService)
    {
        var searchResultValidator = new window.Services.SearchResultNameValidator(new window.Services.DefaultTrackNamePolicy(), new window.Services.DefaultPlaylistNamePolicy());
        var searchResultParser = new window.Services.SearchResultParser(searchResultValidator);
        return new window.UI.MediaLoadViewController(playlistLoaderService, searchService, searchResultParser, window.UI.MediaLoadConfig);
    },

    createPlaylistItemEditorViewController: function(playlistProvider)
    {
        var detailsProvider = new window.LastFm.LastFmApiFactory().createInformationProvider();
        return new window.UI.PlaylistItemDetailsEditorViewController(detailsProvider, playlistProvider, window.UI.PlaylistItemDetailsEditorConfig);
    },

    createColorSchemeControlViewController: function()
    {
        return new window.UI.ColorSchemeControlViewController(window.UI.ColorSchemeControlConfig);
    },

    createUserNotificationViewController: function()
    {
        return new window.UI.UserNotifierViewController($(window.UI.UIControllersFactoryConfig.UserNotificationView), window.UI.UserNotifierConfiguration);
    },

    createProgressbarViewController: function()
    {
        return new window.UI.ProgressbarViewController(window.UI.ProgressbarViewControllerConfiguration, $(window.UI.UIControllersFactoryConfig.ProgressbarView));
    },

    createWelcomeScreenController: function(welcomeScreenService)
    {
        return new window.UI.WelcomeScreenController(window.UI.WelcomeScreenConfiguration, $(window.UI.UIControllersFactoryConfig.WelcomeScreenView), welcomeScreenService);
    },

    createAppDetailsViewController: function()
    {
        return new window.UI.AppDetailsViewController(window.UI.AppDetailsConfig);
    }
};