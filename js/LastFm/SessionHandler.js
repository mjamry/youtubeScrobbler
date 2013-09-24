//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

var UNDEFINED_SESSION_ID = "-1";

//Handles sessions on last.fm portal.
window.LastFm.SessionHandler = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    this.sessionDetails = UNDEFINED_SESSION_ID;
    window.Common.Log.Instance().Info("Last fm session handler has been created.");
}

window.LastFm.SessionHandler.prototype =
{
    createNewSession: function(token, callback)
    {
        window.Common.Log.Instance().Debug("Last fm - new session requested using token: " + token);
        this.lastFmApi.auth.getSession({token:token},
            {
                success: function(response)
                {
                    //Response structure:
                    //<session>
                    //  <name>MyLastFMUsername</name>
                    //  <key>d580d57f32848f5dcf574d1ce18d78b2</key>
                    //  <subscriber>0</subscriber>
                    //</session>
                    this.sessionDetails = response.session;
                    window.Common.Log.Instance().Info("Session established.");
                    window.Common.Log.Instance().Debug("Session details - user: " + this.sessionDetails.name + ", key: "+ this.sessionDetails.key);
                    callback(this.sessionDetails);
                },
                error: function(err, msg)
                {
                    this.sessionDetails = UNDEFINED_SESSION_ID;
                    window.Common.Log.Instance().Error("Error ("+ err +") while creating session: " + msg);
                    callback(UNDEFINED_SESSION_ID);
                }
            });
    },

    getCurrentSessionKey: function()
    {
        if(this.sessionDetails.key !== UNDEFINED_SESSION_ID)
        {
            return this.sessionDetails.key;
        }

        return "Session has not been established."
    }
};
