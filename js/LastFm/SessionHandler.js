//namespace
window.LastFm = window.LastFm || {};

//Handles sessions on last.fm portal.
window.LastFm.SessionHandler = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
}

window.LastFm.SessionHandler.prototype =
{
    getSessionId: function(token, callback)
    {
        this.lastFmApi.auth.getSession({token:token}, callback);
    }
};
