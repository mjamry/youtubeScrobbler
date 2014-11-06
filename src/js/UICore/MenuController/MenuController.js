window.UI = window.UI || {};

window.UI.MenuController = function(view, config, displayCoordintor)
{
    this._view = view;
    this._config = config;
    this._displayCoordinator = displayCoordintor;
};

window.UI.MenuItemPosition =
{
    Top: "top",
    Bottom: "bottom"
};

window.UI.MenuController.prototype =
{
    _onMouseEnter: function(that)
    {
        return function()
        {
            that._view.css("width", that._config.MenuActiveWidth);
        };
    },

    _onMouseLeave: function(that)
    {
        return function()
        {
            that._view.css("width", that._config.MenuInactiveWidth);
        };
    },

    initialise: function()
    {
        this._view.mouseenter(this._onMouseEnter(this));
        this._view.mouseleave(this._onMouseLeave(this));
        this._view.css("width", this._config.MenuInactiveWidth);
    },

    add: function(name, icon, page, position)
    {
        //if position is not set, use Top as default
        position = position || window.UI.MenuItemPosition.Top;
        var item = this._createNewMenuItem(name, icon, page, position);
        this._view.append(item.getControl());
    },

    _createNewMenuItem: function(name, icon, page, position)
    {
        var item = new window.UI.MenuItem(this._config.MenuItemContainer);
        item.setName(name, this._config.MenuItemTitle);
        item.setIcon(icon, this._config.MenuItemIcon);
        item.setPage(page);
        item.setAction(this._handleMenuItemAction());

        return item;
    },

    _handleMenuItemAction: function()
    {
        var that = this;
        return function onMenuItemActioned(item)
        {
            Logger.getInstance().debug("[Menu] Item: '"+item.getName()+"' actioned.");
            that._displayCoordinator.showPage(item.getPage());
        };
    }
};