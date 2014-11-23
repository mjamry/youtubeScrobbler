//using
window.LastFm = window.LastFm || {};

window.LastFm.LastFmApiFactory = function()
{
    this.sessionProvider = null;
};

window.LastFm.LastFmApiFactory.prototype =
{
    _createSessionProvider: function()
    {
        if(this.sessionProvider === null)
        {
            this.sessionProvider = new window.Accounts.LastFmSessionProvider();;
            this.sessionProvider.initialise();
        }

        return this.sessionProvider;
    },

    ///Creates information
    createInformationProvider: function()
    {
        return new window.LastFm.LastFmTrackInformationProvider(LastFmApiCommon.DATA_PROVIDER, this._createSessionProvider());
    },

    createSessionProvider: function()
    {
        return new window.Accounts.LastFmSessionProvider(LastFmApiCommon.DATA_PROVIDER);
    },

    createScrobbler: function()
    {
        return new window.LastFm.Scrobbler(LastFmApiCommon.DATA_PROVIDER, this._createSessionProvider());
    },

    createTrackLoveStateModifier: function()
    {
        return new window.LastFm.TrackLoveStateModifier(LastFmApiCommon.DATA_PROVIDER, this._createSessionProvider());
    }
};