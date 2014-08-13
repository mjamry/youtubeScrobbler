//namespace
window.UI = window.UI || {};

window.UI.UIControllersFactory = function(){};

window.UI.UIControllersFactory.prototype =
{
    createUICore: function()
    {
        return new window.UI.UICore();
    },

    createLoggerViewController: function()
    {
        return new window.UI.LoggerViewController("#logger-content", window.UI.LoggerUIConfig);
    },

    createTestReportViewController: function()
    {
        var reportSender = new window.UI.ReportSender();
        reportSender.initialise();
        return new window.UI.TestReportsViewController(reportSender, window.UI.TestReportUIConfig);
    },

    createPlaylistViewController: function(playlistService, playbackControlService, playlistFlowController)
    {
        return new window.UI.PlaylistViewController(playlistService, playbackControlService, playlistFlowController, "playlist-container", window.UI.PlaylistUIConfig);
    },

    createPlaybackDetailsViewController: function(model)
    {
        return new window.UI.PlaybackDetailsViewController(model, "playback-progress-container", window.UI.PLaybackDetailsViewConfiguration);
    },

    createPlaybackControlViewController: function(player, playbackControlService)
    {
        var volumeControlService = new window.Player.VolumeControlService(player);

        var fullScreenContainer = document.getElementById(window.UI.PlaybackControlConfiguration.FullScreenContainer);
        var sizeControlService = new window.Player.VideoSizeControlService(player, fullScreenContainer, window.Player.MediaPlayerConfig);
        sizeControlService.initialise();
        return new window.UI.PlaybackControlViewController(playbackControlService, volumeControlService, sizeControlService, "playback-control", window.UI.PlaybackControlConfiguration);
    },

    createPlaylistControlViewController: function(playlistService, playlistFlowController, loveStateModifier)
    {
        return new window.UI.PlaylistControlViewController(playlistService, playlistFlowController, loveStateModifier, "playlist-control", window.UI.PlaylistControlConfiguration);
    },

    createSessionViewController: function(sessionHandler)
    {
        return new window.UI.SessionViewController(sessionHandler, window.UI.SessionUIConfiguration);
    },

    createMediaLoadViewController: function(playlistLoaderService, searchService)
    {
        //TODO make configurable which policy is applied
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
        return new window.UI.UserNotifierViewController("#user-notifications-container", window.UI.UserNotifierConfiguration);
    },

    createProgressbarViewController: function()
    {
        return new window.UI.ProgressbarViewController(window.UI.ProgressbarViewControllerConfiguration, $("#progressbar-container"));
    },

    createWelcomeScreenController: function(welcomeScreenService)
    {
        return new window.UI.WelcomeScreenController(window.UI.WelcomeScreenConfiguration, $("#page"), welcomeScreenService);
    },

    createAppDetailsViewController: function()
    {
        return new window.UI.AppDetailsViewController(window.UI.AppDetailsConfig);
    }
};