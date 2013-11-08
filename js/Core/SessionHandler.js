//namespace
window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.SessionHandler = function(sessionProvider)
{
    this._sessionObject = null;
    this._sessionProvider = sessionProvider;
};

window.ApplicationCore.SessionHandler.prototype =
{
    //try to restore last session if it does not exist creates new one.
    createNewSession: function(token)
    {
        if(!this._sessionProvider.isSessionAlreadyCreated())
        {
            this._sessionProvider.create(
                token,
                $.proxy(function(sessionObject)
                {
                    this._sessionObject = sessionObject;
                }, this)
            )
        }
        else
        {
            this._sessionObject = this._sessionProvider.getCurrentSessionKey();
        }
    },

    getSession: function()
    {
        return this._sessionObject;
    }
};

