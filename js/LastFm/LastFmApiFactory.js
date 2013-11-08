//using
window.LastFm = window.LastFm || {};

window.LastFm.LastFmApiFactory = function(){};

window.LastFm.LastFmApiFactory.prototype =
{
    ///Creates information
    createInformationProvider: function()
    {
        return new window.LastFm.InformationProvider(LastFmApiCommon.DATA_PROVIDER);
    },

    createSessionProvider: function()
    {
        return new window.LastFm.LastFmSessionProvider(LastFmApiCommon.DATA_PROVIDER);
    },

    createScrobbler: function()
    {
        return new window.LastFm.Scrobbler(LastFmApiCommon.DATA_PROVIDER);
    },

    createLoveChangeSwitch: function(sessionHandler)
    {
        return new window.LastFm.TrackLoveChangeHandler(this.createScrobbler(), sessionHandler);
    }
};