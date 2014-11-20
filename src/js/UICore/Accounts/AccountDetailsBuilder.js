window.UI = window.UI || {};

window.UI.AccountDetailsBuilder = function(config)
{
    this._config = config;
    this._item = $("#controls-schemes").find(this._config.AccountDetailsContainer).clone();
};

window.UI.AccountDetailsBuilder.prototype =
{
    _createDetailsItem: function(name, value)
    {
        var itemInfo = this._item.find(this._config.AccountInfo);

        var itemDetails = document.createElement("div");
        itemDetails.innerHTML = name + " : "+value;

        itemInfo.append(itemDetails);
    },

    setAccountName: function(name)
    {
        this._item.find(this._config.AccountLegend).text(name);
    },

    setAccountPicture: function(picUrl)
    {
        var img = document.createElement("img");
        img.setAttribute("src", picUrl);

        this._item.find(this._config.AccountPicture).append(img);
    },

    setUserName: function(userName)
    {
        var itemInfo = this._item.find(this._config.AccountInfo);
        var itemDetails = this._createDetailsItem("name", userName);
        itemInfo.prepend(itemDetails);
    },

    //array: {label, value}
    setAccountDetails: function(details)
    {
        for(var name in details)
        {
            var itemInfo = this._item.find(this._config.AccountInfo);
            var itemDetails =             this._createDetailsItem(name, details[name]);

            itemInfo.append(itemDetails);
        }
    },

    build: function()
    {
        return this._item;
    }
};