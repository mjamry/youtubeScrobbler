window.UI = window.UI || {};

//accounts: array of {name, detailsProvider}
window.UI.AccountsViewController = function(view, accounts, config)
{
    this._view = view;
    this._accounts = accounts;
    this._config = config;
};

window.UI.AccountsViewController.prototype =
{
    //accountDetails : {
    // accountName,
    // userName,
    // pictureUrl,
    // otherDetails[]
    // }
    _handleNewSession: function(that)
    {
        return function onSessionEstablished(accountDetails)
        {
            accountDetails.otherDetails.unshift({name: accountDetails.userName});
            var builder = new window.UI.AccountDetailsBuilder(that._config);
            builder.setAccountName(accountDetails.accountName);
            builder.setAccountPicture(accountDetails.pictureUrl);
            builder.setAccountDetails(accountDetails.otherDetails);

            var newAccountItem = builder.build();

            that._view.append(newAccountItem);
        };
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablished, this._handleNewSession(this));
//        EventBroker.getInstance().addListener(window.LastFm.Events.SessionClosed, this._handleSessionClosed(this));
//        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablishmentFailed, this._handleSessionError(this.model, token));
    }
};