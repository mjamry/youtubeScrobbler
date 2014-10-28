window.UI = window.UI || {};

window.UI.MenuController = function(view, config)
{
    this.view = view;
    this.config = config;
};

window.UI.MenuController.prototype =
{
    add: function(menuItemDetails)
    {
        var item = this._createNewMenuItem(menuItemDetails);
        this.view.append(item);
    },

    _setTopPosition: function(item)
    {

    },

    _setBottonPosition: function(item)
    {

    },

    _createNewMenuItem: function(itemDetails)
    {
        var builder = new window.UI.MenuItemBuilder(this.config);
        builder.setTitle(itemDetails.getName());
        builder.setIcon(itemDetails.getIcon());

        return builder.build();
    }
};