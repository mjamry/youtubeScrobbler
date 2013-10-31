//namespace
window.UI = window.UI || {};

window.UI.UIControllersFactory = function(){};

window.UI.UIControllersFactory.prototype =
{
    createLoggerViewController: function()
    {
        return new window.UI.LoggerViewController("logger", window.UI.LoggerUIConfig);
    },

    createTestReportViewController: function()
    {
        return new window.UI.TestReportsViewController(new window.UI.ReportSender(), window.UI.TestReportUIConfig);
    },

    createPlaylistViewController: function()
    {
        return new window.UI.PlaylistViewController("playlist", window.UI.PlaylistUIConfig);
    }
};