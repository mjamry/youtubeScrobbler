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
        var sizeControlService = new window.Player.VideoSizeControlService(player);
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

    createMediaLoadViewController: function(playlistService)
    {
        return new window.UI.MediaLoadViewController(playlistService, window.UI.MediaLoadConfig);
    },

    createPlaylistItemEditorViewController: function(playlistProvider)
    {
        var detailsProvider = new window.LastFm.LastFmApiFactory().createInformationProvider();
        return new window.UI.PlaylistItemDetailsEditorViewController(detailsProvider, playlistProvider, window.UI.PlaylistItemDetailsEditorConfig);
    },

    createColorSchemeControlViewController: function()
    {
        return new window.UI.ColorSchemeControlViewController(window.UI.ColorSchemeControlConfig);
    }
};