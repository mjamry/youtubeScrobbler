//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Handles sessions on last.fm portal.
window.LastFm.SessionHandler = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    window.Common.Log.Instance().Info("Last fm session handler has been created.");
}

window.LastFm.SessionHandler.prototype =
{
    getSessionId: function(token, callback)
    {
        window.Common.Log.Instance().Debug("Last fm - new session requested using token: "+token);
        this.lastFmApi.auth.getSession({token:token}, callback);
    }
};
