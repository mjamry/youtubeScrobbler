//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};
window.Common = window.Common || {};
window.LastFm = window.LastFm || {};

window.ApplicationCore.OnlineScrobbler = function()
{
    this._sessionObject = null;
    this._lastFmFactory = new window.LastFm.LastFmApiFactory();
    this._lastFmInformationProvider = this._lastFmFactory.createInformationProvider();
    this._scrobbler = this._lastFmFactory.createScrobbler();

    this._trackStartedTimestamp = null;

    this._currentlyLoaded = null;
};

window.ApplicationCore.OnlineScrobbler.prototype =
{
    //TODO this value should be stored as time and formated only on demand.
    _generateTimestamp: function()
    {
        return Math.round((new Date()).getTime() / 1000);
    },

    _updateScrobbling: function(mediaDetails)
    {
        //validate if track was played longer than 30 seconds.
        this._scrobbler.scrobble(
            {
                track: mediaDetails.title,
                artist: mediaDetails.artist,
                //it is in ms so it must be divided by 1000, also need to be rounded to make an int value
                timestamp: this._trackStartedTimestamp
            },
            this._sessionObject
        );
    },

    _updateNowPlaying: function(mediaDetails)
    {
        //update now playing only when new track is loaded - it prevents before reaction on pause/play events
        if(this._currentlyLoaded != mediaDetails)
        {
            this._currentlyLoaded = mediaDetails;
            this._trackStartedTimestamp = this._generateTimestamp();
            this._scrobbler.updateNowPlaying(
                {
                    track: mediaDetails.title,
                    artist: mediaDetails.artist
                },
                this._sessionObject
            );
        }
    },

    initialise: function()
    {
        window.Common.EventBrokerSingleton.instance().addListener(
            window.Player.Events.VideoPlay,
            $.proxy(function(mediaDetails)
            {
                this._updateNowPlaying(mediaDetails);
            }, this)
        );

        window.Common.EventBrokerSingleton.instance().addListener(
            window.Player.Events.videoStopped,
            $.proxy(function(mediaDetails)
            {
                this._updateScrobbling(mediaDetails);
            }, this)
        )
    },

    //try to restore last session if it does not exist creates new one.
    createNewSession: function(token)
    {
        var sessionHandler = this._lastFmFactory.createSessionHandler();

        if(!sessionHandler.isSessionAlreadyCreated())
        {
            sessionHandler.createNewSession(
                token,
                $.proxy(function(sessionObject)
                {
                    this._sessionObject = sessionObject;
                }, this)
            )
        }
        else
        {
            this._sessionObject = sessionHandler.getCurrentSessionKey();
        }
    }
};
