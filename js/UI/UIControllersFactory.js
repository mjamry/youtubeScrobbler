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
        return new window.UI.TestReportsViewController(new window.UI.ReportSender(), window.UI.TestReportUIConfig);
    },

    createPlaylistViewController: function(model)
    {
        return new window.UI.PlaylistViewController(model, "playlist-container", window.UI.PlaylistUIConfig);
    }
};