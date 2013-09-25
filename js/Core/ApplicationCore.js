//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};

window.ApplicationCore.AppCore = function(factory)
{
    this._uiCore = new window.UI.UICore();
    this._onlineScrobbler = factory.createOnlineScrobbler();
    this._onlineScrobbler.initialisePlayer
    (
        this._uiCore.getPlayerContainer(),
        this._uiCore.getPlaylistContainer(),
        this._uiCore.getTimeElapsedContainer()
    );
};

window.ApplicationCore.AppCore.prototype =
{
    initialise: function()
    {
        //TODO: move here initialisation of services
    },

    getPlayer: function()
    {
        return this._onlineScrobbler.getPlayer();
    },

    createNewSession: function(token)
    {
        this._onlineScrobbler.createNewSession(token);
    }
}
