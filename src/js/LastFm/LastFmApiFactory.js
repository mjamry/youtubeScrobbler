//using
window.LastFm = window.LastFm || {};

window.LastFm.LastFmApiFactory = function(){};

window.LastFm.LastFmApiFactory.prototype =
{
    ///Creates information
    createInformationProvider: function()
    {
        var sessionProvider = new window.Accounts.LastFmSessionProvider();
        sessionProvider.initialise();
        return new window.LastFm.LastFmTrackInformationProvider(LastFmApiCommon.DATA_PROVIDER, sessionProvider);
    },

    createSessionProvider: function()
    {
        return new window.Accounts.LastFmSessionProvider(LastFmApiCommon.DATA_PROVIDER);
    },

    createScrobbler: function()
    {
        return new window.LastFm.Scrobbler(LastFmApiCommon.DATA_PROVIDER);
    },

    createTrackLoveStateModifier: function()
    {
        return new window.LastFm.TrackLoveStateModifier(LastFmApiCommon.DATA_PROVIDER);
    }
};