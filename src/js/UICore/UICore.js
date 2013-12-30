//namespace
window.UI = window.UI || {};

window.UI.UICore = function(){};

window,UI.UICore.prototype =
{
    getPlayerContainer: function()
    {
        return window.UI.UIConstants.PlayerContainer;
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
