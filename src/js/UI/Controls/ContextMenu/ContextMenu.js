window.UI = window.UI || {};

window.UI.ContextMenu = function(body)
{
    this.body = body;
};

window.UI.ContextMenu.prototype =
{
    _handleLostFocus: function()
    {

    },

    _initialise: function()
    {

    },

    Hide: function()
    {
        $(this.body).hide();
    },

    Show: function()
    {

    }
};