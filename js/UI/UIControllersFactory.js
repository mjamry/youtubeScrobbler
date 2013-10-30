//namespace
window.UI = window.UI || {};

window.UI.UIControllersFactory = function(){};

window.UI.UIControllersFactory.prototype =
{
    createLoggerViewController: function()
    {
        return new window.UI.LoggerViewControler(window.UI.LoggerUIConfig);
    },

    createTestReportViewController: function()
    {
        return new window.UI.TestReportsViewController(window.UI.TestReportUIConfig);
    },

    createPlaylistViewController: function()
    {
        return new window.UI.PlaylistViewController(window.UI.PlaylistUIConfig);
    }
}