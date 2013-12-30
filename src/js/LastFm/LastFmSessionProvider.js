//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Handles sessions on last.fm portal.
window.LastFm.LastFmSessionProvider = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    this.sessionDetails = null;
    Logger.getInstance().Info("Last fm session handler has been created.");
};

window.LastFm.LastFmSessionProvider.prototype =
{
    _setSession: function(sessionDetails)
    {
        this.sessionDetails = sessionDetails;
        //stores session details
        window.Common.Cookie.instance().setCookie(window.Common.CookiesNames.sessionCookie, this.sessionDetails);

        Logger.getInstance().Info("Session established.");
        Logger.getInstance().Debug("Session details - user: " + this.sessionDetails.name + ", key: "+ this.sessionDetails.key);
        EventBroker.getInstance().fireEventWithData(window.LastFm.Events.SessionEstablished, this.sessionDetails.name);
    },

    create: function(token)
    {
        Logger.getInstance().Debug("Last fm - new session requested using token: " + token);
        this.lastFmApi.auth.getSession({token:token},
            {
                success: $.proxy(function(response)
                {
                    //Response structure:
                    //<session>
                    //  <name>MyLastFMUsername</name>
                    //  <key>d580d57f32848f5dcf574d1ce18d78b2</key>
                    //  <subscriber>0</subscriber>
                    //</session>

                    this._setSession(response.session);
                }, this),

                error: $.proxy(function(err, msg)
                {
                    this.sessionDetails = null;
                    Logger.getInstance().Warning("Error ("+ err +") while creating session: " + msg);
                }, this)
            });
    },

    isSessionAlreadyCreated: function()
    {
        var lastSession = window.Common.Cookie.instance().getCookie(window.Common.CookiesNames.sessionCookie);
        if(lastSession)
        {
            this._setSession(lastSession);
            return true;
        }

        return false;
    },

    getSession: function()
    {
        return this.sessionDetails;
    }
};
