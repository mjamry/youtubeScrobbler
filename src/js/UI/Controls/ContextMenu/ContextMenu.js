window.UI = window.UI || {};

window.UI.ContextMenu = function(body)
{
    this.body = $(body);
    //needed to be able to set focus on the menu
    this.body.attr("tabindex", -1);
    this._initialise();
};

window.UI.ContextMenu.prototype =
{
    _handleLostFocus: function()
    {
        this.hide();
    },

    _initialise: function()
    {
        this.body.on("blur", this._handleLostFocus.bind(this));
    },

    getBody: function()
    {
        return this.body[0];
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

        this.body.focus();
    }
};