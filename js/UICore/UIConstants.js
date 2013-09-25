//namespace
window.UI = window.UI || {};

window.UI.UIConstants =
{
    PlayerContainer: ".youtube-player",
    PlaylistContainer: "#playlist .content",
    TimeElapsedContainer: "#player .time"
}

window.UI.UICore = function(){};

window,UI.UICore.prototype =
{
    getPlayerContainer: function()
    {
        return $(window.UI.UIConstants.PlayerContainer);
    },

    getPlaylistContainer: function()
    {
        return $(window.UI.UIConstants.PlaylistContainer);
    },

    getTimeElapsedContainer: function()
    {
        return $(window.UI.UIConstants.TimeElapsedContainer);
    }
}