window.UI = window.UI || {};

window.UI.ContextMenu = function(body)
{
    this.body = $(body);
    this.body2 = body;
};

window.UI.ContextMenu.prototype =
{
    _handleLostFocus: function()
    {

    },

    _initialise: function()
    {
        this.body.on("blur", this.hide);
    },

    getBody: function()
    {
        return this.body2;
    },

    hide: function()
    {
        this.body.hide();
    },

    show: function(coordinates)
    {
        //have to show first to be able to set position
        this.body.show();
        this.body.offset(
            {
                top: coordinates.top,
                left: coordinates.left
            });
    }
};