//namespace
window.UI = window.UI || {};

window.UI.UICore = function(){};

//TODO use const instead of this
window.UI.UICore.prototype =
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
};
