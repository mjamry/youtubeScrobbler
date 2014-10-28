window.UI = window.UI || {};

window.UI.MenuItem = function(name, icon, position, page)
{
    this._name = name;
    this._icon = icon;
    this._position = position;
    this._page = page;
};

window.UI.MenuItem.prototype =
{
    getName: function()
    {
        return this._name;
    },

    getIcon: function()
    {
        return this._icon;
    },

    getPosition: function()
    {
        return this._position;
    },

    getPage: function()
    {
        return this._page;
    }
};