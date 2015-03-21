//using
window.LastFm = window.LastFm || {};

window.LastFm.LastFmApiFactory = function()
{
    this.sessionProvider = null;

        this.CACHE = new LastFMCache();

        this.DATA_PROVIDER= new LastFM({
            apiKey: window.LastFm.LastFmConstants.API_KEY,
            apiSecret: window.LastFm.LastFmConstants.API_SECRET,
            cache: this.CACHE
        })
};

window.LastFm.LastFmApiFactory.prototype =
{
    _createSessionProvider: function()
    {
        if(this.sessionProvider === null)
        {
            this.sessionProvider = new window.Accounts.LastFmSessionProvider();
            this.sessionProvider.initialise();
        }

        return this.sessionProvider;
    },

    ///Creates information
    createTrackInformationProvider: function()
    {
        return new window.LastFm.LastFmTrackInformationProvider(this.DATA_PROVIDER, this._createSessionProvider());
    },

    createScrobbler: function()
    {
        return new window.LastFm.Scrobbler(this.DATA_PROVIDER, this._createSessionProvider());
    },

    createTrackLoveStateModifier: function()
    {
        return new window.LastFm.TrackLoveStateModifier(this.DATA_PROVIDER, this._createSessionProvider());
    },

    createSessionCoordinator: function()
    {
        var lastFmTokenHandler = new window.Accounts.LastFmTokenHandler(window.Accounts.LastFmSessionConstants);
        return new window.Accounts.LastFmSessionCoordinator(this.DATA_PROVIDER, lastFmTokenHandler);
    }
};