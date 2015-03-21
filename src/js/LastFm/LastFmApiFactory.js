//using
window.LastFm = window.LastFm || {};

window.LastFm.LastFmApiFactory = function()
{
    this.sessionProvider = null;
    this.dataProvider = null;
};

window.LastFm.LastFmApiFactory.prototype =
{
    _getDataProvider: function()
    {
        if(this.dataProvider == null)
        {
            var cache = new LastFMCache();

            this.dataProvider = new LastFM(
                {
                    apiKey: window.LastFm.LastFmConstants.API_KEY,
                    apiSecret: window.LastFm.LastFmConstants.API_SECRET,
                    cache: cache
                });
        }

        return this.dataProvider;
    },

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
        return new window.LastFm.LastFmTrackInformationProvider(this._getDataProvider(), this._createSessionProvider());
    },

    createScrobbler: function()
    {
        return new window.LastFm.Scrobbler(this._getDataProvider(), this._createSessionProvider());
    },

    createTrackLoveStateModifier: function()
    {
        return new window.LastFm.TrackLoveStateModifier(this._getDataProvider(), this._createSessionProvider());
    },

    createSessionCoordinator: function()
    {
        var lastFmTokenHandler = new window.Accounts.LastFmTokenHandler(window.Accounts.LastFmSessionConstants);
        return new window.Accounts.LastFmSessionCoordinator(this._getDataProvider(), lastFmTokenHandler);
    }
};
