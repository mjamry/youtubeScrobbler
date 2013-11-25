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
        return new window.UI.LoggerViewController("logger-content", window.UI.LoggerUIConfig);
    },

    createTestReportViewController: function()
    {
        var reportSender = new window.UI.ReportSender();
        reportSender.initialise();
        return new window.UI.TestReportsViewController(reportSender, window.UI.TestReportUIConfig);
    },

    createPlaylistViewController: function(playlistService, playbackControlService, loveStateModifier)
    {
        return new window.UI.PlaylistViewController(playlistService, playbackControlService, loveStateModifier, "playlist-container", window.UI.PlaylistUIConfig);
    },

    createPlaybackDetailsViewController: function(model)
    {
        return new window.UI.PlaybackDetailsViewController(model, "playback-progress-container", window.UI.PLaybackDetailsViewConfiguration);
    },

    createPlaybackControlViewController: function(playbackControlService)
    {
        return new window.UI.PlaybackControlViewController(playbackControlService, "playback-control", window.UI.PlaybackControlConfiguration);
    },

    createPlaylistControlViewController: function(model)
    {
        return new window.UI.PlaylistControlViewController(model, "playlist-control", window.UI.PlaylistControlConfiguration);
    }


};