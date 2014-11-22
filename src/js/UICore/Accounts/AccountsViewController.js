window.UI = window.UI || {};

//accounts: array of {name, detailsProvider}
window.UI.AccountsViewController = function(view, accounts, sessionService, config)
{
    this.view = view;
    this.accounts = accounts;
    this.sessionService = sessionService;
    this.config = config;
};

window.UI.AccountsViewController.prototype =
{
    _createAccountLogInButton: function(accountName)
    {
        var clickHandler = function(that, accountName)
        {
            return function onLogInButtonClicked()
            {
                that.sessionService.establishSession(accountName);
            };
        };

        var button = document.createElement("button");
        button.className = this.config.LogInButton;
        button.className += " "+accountName;

        button.innerHTML = "Log in to your "+accountName+" account";

        button.onclick = clickHandler(this, accountName);

        this.view.append(button);
    },

    //passed window.Accounts.SessionDetails
    _handleNewSession: function(that)
    {
        return function onSessionEstablished(sessionDetails)
        {
            //hide log in button (needed to add . because of class name)
            that.view.find("."+sessionDetails.AccountName).hide();

            //create new session details view
            var builder = new window.UI.AccountDetailsBuilder(that.config);
            builder.setAccountName(sessionDetails.AccountName);
            builder.setAccountPicture(sessionDetails.PictureUrl);
            builder.setAccountDetails(sessionDetails.Details);
            builder.setUserName(sessionDetails.UserName);

            var newAccountItem = builder.build();

            that.view.append(newAccountItem);
        };
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablished, this._handleNewSession(this));

        for(var account in this.accounts)
        {
            this._createAccountLogInButton(this.accounts[account]);
        }
    }
};