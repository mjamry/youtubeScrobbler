window.UI = window.UI || {};

window.UI.AccountDetailsBuilder = function(config)
{
    this._config = config;
    this._item = $("#controls-schemes").find(this._config.AccountDetailsContainer).clone();
};

window.UI.AccountDetailsBuilder.prototype =
{
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

    //array: {label, value}
    setAccountDetails: function(details)
    {
        var itemInfo = this._item.find(this._config.AccountInfo);

        for(var item in details)
        {
            for(var name in details[item])
            {
                var itemDetails = document.createElement("div");
                itemDetails.innerHTML = name + " : "+details[item][name];

                itemInfo.append(itemDetails);
            }

        }
    },

    build: function()
    {
        return this._item;
    }
};