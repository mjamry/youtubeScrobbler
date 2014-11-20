window.Accounts = window.Accounts || {};

window.Accounts.SessionService = function(sessionCoordinators)
{
    this._accounts = sessionCoordinators;
};

window.Accounts.SessionService.prototype =
{
    _handleSessionEstablished: function(sessionDetails)
    {
        EventBroker.getInstance().fireEventWithData(window.LastFm.Events.SessionEstablished, sessionDetails);
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

    //initialises session coordinators
    initialise: function()
    {
        for(var accountName in this._accounts)
        {
            this.refreshSession(accountName);
        }
    }
};

