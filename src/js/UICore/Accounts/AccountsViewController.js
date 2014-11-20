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
    //passed window.Accounts.SessionDetails
    _handleNewSession: function(that)
    {
        return function onSessionEstablished(sessionDetails)
        {
            var builder = new window.UI.AccountDetailsBuilder(that._config);
            builder.setAccountName(sessionDetails.AccountName);
            builder.setAccountPicture(sessionDetails.PictureUrl);
            builder.setAccountDetails(sessionDetails.Details);
            builder.setUserName(sessionDetails.UserName);

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