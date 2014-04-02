//namespace
window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.SessionHandler = function(sessionProvider)
{
    this.currentSession = null;
    this._sessionProvider = sessionProvider;
};

window.ApplicationCore.SessionHandler.prototype =
{
    _postSessionObtained: function()
    {
        Logger.getInstance().info("Session has been established.");
        Logger.getInstance().debug("Session details - user: " + this.currentSession.name + ", key: "+ this.currentSession.key);
        EventBroker.getInstance().fireEventWithData(window.LastFm.Events.SessionEstablished, this.currentSession.name);
    },

    _handleSessionObtained: function(that)
    {
        return function(session)
        {
            that.currentSession = session;
            that._setSessionCookie(session);

            that._postSessionObtained();
        };
    },

    _handleSessionObtainingFailed: function()
    {
        this.currentSession = null;
        EventBroker.getInstance().fireEvent(window.LastFm.Events.SessionEstablishmentFailed);
    },

    _setSessionCookie: function(session)
    {
        Cookie.getInstance().setCookie(window.Common.CookiesNames.sessionCookie, session);
    },

    _getSessionCookie: function()
    {
        var lastSession = Cookie.getInstance().getCookie(window.Common.CookiesNames.sessionCookie);
        if(!lastSession)
        {
            lastSession = null;
        }

        return lastSession;
    },

    //closes current session
    closeSession: function()
    {
        Cookie.getInstance().removeCookie(window.Common.CookiesNames.sessionCookie);
        this.currentSession = null;
        EventBroker.getInstance().fireEvent(window.LastFm.Events.SessionClosed);
    },

    //try to restore last session if it does not exist creates new one.
    createNewSession: function(token)
    {
        //get stored session
        this.currentSession = this._getSessionCookie();

        //if there is no session stored establish new one
        if(this.currentSession === null)
        {
            this._sessionProvider.create(
                token,
                {
                    success: this._handleSessionObtained(this),
                    error: this._handleSessionObtainingFailed
                }
            );
        }
        else
        {
            this._postSessionObtained();
        }
    },

    isSessionEstablished: function()
    {
        return this.currentSession !== null;
    },

    //returns current session
    getSession: function()
    {
        if(this.currentSession !== null)
        {
            return this.currentSession;
        }

        Logger.getInstance().warning("Session has not been established yet.");
        //TODO - change it to null
        return {name:""};
    }
};

