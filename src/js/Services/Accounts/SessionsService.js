window.Accounts = window.Accounts || {};

window.Accounts.SessionManager = function(sessionCoordinators)
{
    this._accounts = sessionCoordinators;
};

window.Accounts.SessionManager.prototype =
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
    }
};

