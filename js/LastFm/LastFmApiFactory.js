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

    createSessionHandler: function()
    {
        return new window.LastFm.SessionHandler(LastFmApiCommon.DATA_PROVIDER);
    },

    createScrobbler: function()
    {
        return new window.LastFm.Scrobbler(LastFmApiCommon.DATA_PROVIDER);
    }
}