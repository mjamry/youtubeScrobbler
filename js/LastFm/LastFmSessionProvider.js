//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

var UNDEFINED_SESSION_ID = "-1";

//Handles sessions on last.fm portal.
window.LastFm.LastFmSessionProvider = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    this.sessionDetails = UNDEFINED_SESSION_ID;
    window.Common.Log.Instance().Info("Last fm session handler has been created.");
};

window.LastFm.LastFmSessionProvider.prototype =
{
    _setSession: function(sessionDetails)
    {
        this.sessionDetails = sessionDetails;
        //stores session details
        window.Common.Cookie.instance().setCookie(window.Common.CookiesNames.sessionCookie, this.sessionDetails);

        window.Common.Log.Instance().Info("Session established.");
        window.Common.Log.Instance().Debug("Session details - user: " + this.sessionDetails.name + ", key: "+ this.sessionDetails.key);
        window.Common.EventBrokerSingleton.instance().fireEventWithData(window.LastFm.Events.SessionEstablished, this.sessionDetails.name);
    },

    create: function(token, callback)
    {
        window.Common.Log.Instance().Debug("Last fm - new session requested using token: " + token);
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
                    callback(this.sessionDetails);
                }, this),

                error: $.proxy(function(err, msg)
                {
                    this.sessionDetails = UNDEFINED_SESSION_ID;
                    window.Common.Log.Instance().Error("Error ("+ err +") while creating session: " + msg);
                    callback(UNDEFINED_SESSION_ID);
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

    getCurrentSessionKey: function()
    {
        if(this.sessionDetails)
        {
            return this.sessionDetails;
        }

        return "Session has not been established."
    }
};
