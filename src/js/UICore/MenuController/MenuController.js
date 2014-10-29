window.UI = window.UI || {};

window.UI.MenuController = function(view, config)
{
    this._view = view;
    this._config = config;
};

window.UI.MenuController.prototype =
{
    _onMouseEnter: function(that)
    {
        return function()
        {
            that._view.css("width", that._config.MenuActiveWidth);
        }
    },

    _onMouseLeave: function(that)
    {
        return function()
        {
            that._view.css("width", that._config.MenuInactiveWidth);
        }
    },

    initialise: function()
    {
        this._view.mouseenter(this._onMouseEnter(this));
        this._view.mouseleave(this._onMouseLeave(this));
        this._view.css("width", this._config.MenuInactiveWidth);
    },

    add: function(name, icon, position, action)
    {
        var item = this._createNewMenuItem(name, icon, page, position);
        this._view.append(item.getControl());
    },

    _setTopPosition: function(item)
    {

    },

    _setBottonPosition: function(item)
    {

    },

    _createNewMenuItem: function(name, icon, page, position)
    {
        var item = new window.UI.MenuItem(this._config.MenuItemContainer);
        item.setName(name, this._config.MenuItemTitle);
        item.setIcon(icon, this._config.MenuItemIcon);
        item.setAction(this._handleMenuItemAction());
        return item;
    },

    _handleMenuItemAction: function()
    {
        return function onMenuItemActioned(item)
        {
            console.log(item.getName());
        }
    }
};