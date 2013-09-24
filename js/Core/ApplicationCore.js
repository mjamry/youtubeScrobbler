//namespace
window.ApplicationCore = window.ApplicationCore || {};


window.ApplicationCore.AppCore = function(factory)
{
    this._onlineScrobbler = factory.createOnlineScrobbler();
    this._onlineScrobbler.initialisePlayer();
};

window.ApplicationCore.AppCore.prototype =
{
    getPlayer: function()
    {
        //TODO expose player instance by function
        return this._onlineScrobbler._player;
    },

    createNewSession: function(token)
    {
        this._onlineScrobbler.createNewSession(token);
    }
}
