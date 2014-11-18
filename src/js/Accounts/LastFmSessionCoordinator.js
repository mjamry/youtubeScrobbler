window.Accounts = window.Accounts || {};

window.Accounts.LastFmSessionCoordinator = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
};

window.Accounts.LastFmSessionCoordinator.protorype =
{

    _refreshSession: function(token)
    {
        Logger.getInstance().debug("[LastFm] Refreshing session using token: " + token);
        return new Promise(function(resolve, reject)
        {
            this.lastFmApi.auth.getSession({token:token}, {success: resolve, error: reject});
        });
    },

    //Response structure:
    //<session>
    //  <name>MyLastFMUsername</name>
    //  <key>d580d57f32848f5dcf574d1ce18d78b2</key>
    //  <subscriber>0</subscriber>
    //</session>
    _standardiseSessionDetails: function(details)
    {

    },

    establishSession: function(callback)
    {

    },

    refreshSession: function(callback)
    {
        var lastSessionToken = Cookie.getInstance().getCookie(window.Common.CookiesNames.sessionCookie);
        if(lastSessionToken == null)
        {
            Logger.getInstance().debug("[LastFm] Cannot refresh session token does not exist.");
            return Promise.reject();
        }

        var that = this;
        this._refreshSession(lastSessionToken).then(
            function onSessionRefreshSuccess(response)
            {
                Logger.getInstance().debug("[LastFm] Session has been refreshed.");
                //TODO obtain user info here
                callback(that._standardiseSessionDetails(response));
            },
            function onSessionRefreshError(error, msg)
            {
                Logger.getInstance().debug("[LastFm] Session refreshing error: "+msg);
            }
        );
    }
};