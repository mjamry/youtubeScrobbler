window.UI = window.UI || {};

window.UI.ContextMenu = function(config)
{
    this.config = config;
    this.body = document.createElement('div');
    this.body.className += this.config.ContextMenuBody;
};

window.UI.ContextMenu.prototype =
{
    _hideMenu: function()
    {
        this.body.hide();
    },

    _createIcon: function(iconClass)
    {
        var icon = document.createElement("i");
        icon.className += iconClass;

        return icon;
    },

    _handleClickAction: function(that, handler)
    {
        return new function (e)
        {
            e.stopPropagation();
            handler.call();
            that._hideMenu();
        };
    },

    addItem: function(icon, text, action)
    {
        var newMenuItem = $("#controls-schemes .context-menu-item").clone();
        newMenuItem.find(this.config.ContextMenuItemIcon).append(this._createIcon(icon));
        newMenuItem.find(this.config.ContextMenuItemTitle).append(text);

        newMenuItem.click(this._handleClickAction(this, action));

        this.body.appendChild(newMenuItem);
    },

    buildMenu: function()
    {
        return this.body;
    }
};