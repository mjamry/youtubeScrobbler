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
        var item = this._createNewmenuItem(menuItemDetails);
        this.view.append(item);
    },

    _setTopPosition: function(item)
    {

    },

    _setBottonPosition: function(item)
    {

    },

    _createNewmenuItem: function(itemDetails)
    {
        var newItem = document.createElement("div");
        newItem.width = this.config.Width;
        newItem.height = this.config.Height;

        newItem.name = itemDetails.name+"_menu_item";

        var newItemButton = document.createElement("div");
        newItemButton.className = this.config.MenuItemButtonStyle;
        newItem.width = this.config.ButtonWidth;
        newItem.height = this.config.ButtonHeight;
        newItemButton.appendChild(this._createIcon(itemDetails));

        newItem.appendChild(newItemButton);

        return newItem;
    },

    _createIcon: function(itemDetails)
    {
        var icon = document.createElement("i");
        icon.className = itemDetails.icon;

        return icon;
    }
};