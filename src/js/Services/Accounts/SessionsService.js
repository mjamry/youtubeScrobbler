window.Accounts = window.Accounts || {};

window.Accounts.SessionService = function(sessionCoordinators)
{
    this._accounts = sessionCoordinators;
};

window.Accounts.SessionService.prototype =
{
    //session details -> window.Accounts.SessionDetails
    _handleSessionEstablished: function(sessionDetails)
    {
        EventBroker.getInstance().fireEventWithData(window.Accounts.SessionEvents.SessionEstablished, sessionDetails);
        UserNotifier.getInstance().info("Session for your "+sessionDetails.AccountName+" account has been established.");
    },

    establishSession: function(accountName)
    {
        this._accounts[accountName].establishSession(this._handleSessionEstablished);
    },

    refreshSession: function(accountName)
    {
        this._accounts[accountName].refreshSession(this._handleSessionEstablished);
    },

    getSessionDetails: function(accountName)
    {
        return this._accounts[accountName].getSessionDetails();
    },

    //initialises
    initialise: function()
    {
        Logger.getInstance().info("[Session] Session service initialised.");

        var callbackCreator = function(that, name)
        {
            return function()
            {
                that.refreshSession(name);
                Logger.getInstance().info("[Session] "+name+" session coordinator initialised.");
            };
        };

        for(var accountName in this._accounts)
        {
            this._accounts[accountName].initialise(callbackCreator(this, accountName));
        }
    }
};

