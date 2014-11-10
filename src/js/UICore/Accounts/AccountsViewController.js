window.UI = window.UI || {};

//accounts: array of {name, detailsProvider}
window.UI.AccountsViewController = function(accounts, config)
{
    this._accounts = accounts;
    this._config = config;
};

window.UI.AccountsViewController.prototype =
{
    initialise: function()
    {
        for(var i in this._accounts)
        {
            var builder = new window.UI.AccountDetailsBuilder(this._config);
            builder.setAccountName(this._accounts[i].name);
            builder.setAccountPicture(this._accounts)
        }
    }
};