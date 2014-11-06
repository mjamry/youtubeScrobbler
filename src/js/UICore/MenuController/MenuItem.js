window.UI = window.UI || {};

window.UI.MenuItem = function(container)
{
    this._action = null;
    this._page = null;
    this._name = "";
    this._itemView = $("#controls-schemes").find(container).clone();
};

window.UI.MenuItem.prototype =
{
    setName: function(name, container)
    {
        this._name = name;
        var itemTitle = this._itemView.find(container);
        itemTitle.html(name);
    },

    setIcon: function(icon, container)
    {
        var itemIcon = this._itemView.find(container);
        itemIcon.addClass(icon);
    },

    setItemView: function(view)
    {
        this._itemView = view;
    },

    setAction: function(action)
    {
        this._action = action;
        this._itemView.mousedown(this._handleItemActioned(action));
    },

    setPage: function(page)
    {
        this._page = page;
    },

    getPage: function()
    {
        return this._page;
    },

    getControl: function()
    {
        return this._itemView;
    },

    getName: function()
    {
        return this._name;
    },

    _handleItemActioned: function(action)
    {
        var that = this;
        return function()
        {
            action(that);
        }
    }
};