//namespace
window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.SessionHandler = function(sessionProvider)
{
    this._sessionProvider = sessionProvider;
};

window.ApplicationCore.SessionHandler.prototype =
{
    //try to restore last session if it does not exist creates new one.
    createNewSession: function(token)
    {
        if(!this._sessionProvider.isSessionAlreadyCreated())
        {
            this._sessionProvider.create(token);
        }
    },

    getSession: function()
    {
        var session = this._sessionProvider.getSession();
        if(session != null)
        {
            return session;
        }
        var errorMsg = "Session has not been established yet.";
        Logger.getInstance().Warning(errorMsg);
        return {name:""}
    }
};

