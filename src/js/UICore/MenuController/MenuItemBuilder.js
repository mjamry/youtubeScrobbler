window.UI = window.UI || {};

window.UI.MenuItemBuilder = function(config)
{
    var newItem = $("#controls-schemes").find(".menu-item-container");
    this._item = newItem.clone();

    this._config = config;
};

window.UI.MenuItemBuilder.prototype =
{
    setTitle: function(title)
    {
        var itemTitle = this._item.find(this._config.MenuItemTitle);
        itemTitle.html(title);
    },

    setIcon: function(icon)
    {
        var itemIcon = this._item.find(this._config.MenuItemIcon);
        itemIcon.addClass(icon);
    },

    build: function()
    {
        return this._item;
    }
};