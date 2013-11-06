//namespace
window.UI = window.UI || {};

window.UI.UIControllersFactory = function(){};

window.UI.UIControllersFactory.prototype =
{
    createLoggerViewController: function()
    {
        return new window.UI.LoggerViewController("logger-content", window.UI.LoggerUIConfig);
    },

    createTestReportViewController: function()
    {
        return new window.UI.TestReportsViewController(new window.UI.ReportSender(), window.UI.TestReportUIConfig);
    },

    createPlaylistViewController: function()
    {
        return new window.UI.PlaylistViewController("playlist-container", window.UI.PlaylistUIConfig);
    }
};