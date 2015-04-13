window.UI = window.UI || {};

window.UI.ContextMenuBuilder = function(config)
{
    this.config = config;
    this.body = document.createElement(this.config.MenuBodyElement);
    this.body.className += this.config.ContextMenuBody;
};

window.UI.ContextMenuBuilder.prototype =
{
    _createIcon: function(iconClass)
    {
        var icon = document.createElement("i");
        icon.className += iconClass;

        return icon;
    },

    _handleClickAction: function(that, handler)
    {
        return function handleContextMenuItemActioned(e)
        {
            e.stopPropagation();
            handler.call();
            $(that.body).hide();
        };
    },

    addItem: function(menuItemDetails)
    {
        var newMenuItem = $("#controls-schemes .context-menu-item").clone();
        newMenuItem.find(this.config.ContextMenuItemIcon).append(this._createIcon(menuItemDetails.icon));
        newMenuItem.find(this.config.ContextMenuItemTitle).append(menuItemDetails.label);

        newMenuItem.click(this._handleClickAction(this, menuItemDetails.action));

        this.body.appendChild(newMenuItem[0]);
    },

    addSeparator: function()
    {
        var separator = document.createElement(this.config.MenuSeparatorElement);
        var separatorLine = document.createElement("hr");
        separator.className += this.config.SeparatorLineClass;
        separator.appendChild(separatorLine);

        this.body.appendChild(separator);
    },

    build: function()
    {
        return new window.UI.ContextMenu(this.body);
    }
};