window.UI = window.UI || {};

window.UI.MenuItem = function(name, icon, position, page)
{
    this.name = name;
    this.icon = icon;
    this.position = position;
    this.page = page;
};

window.UI.MenuItem.prototype =
{
    getName: function()
    {
        return this.name;
    },

    getIcon: function()
    {
        return this.icon;
    },

    getPosition: function()
    {
        return this.position;
    },

    getPage: function()
    {
        return this.page;
    }
};