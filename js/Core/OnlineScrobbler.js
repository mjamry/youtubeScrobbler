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

    this._trackStartPlayingTime = null;

    this._currentlyLoaded = null;
    window.Common.Log.Instance().Info("Online scrobbler has been created.");
};

window.ApplicationCore.OnlineScrobbler.prototype =
{
    //TODO this value should be stored as time and formated only on demand.
    _getTimeInSeconds: function(timeInMs)
    {
        //it is in ms so it must be divided by 1000, also need to be rounded to make an int value
        return Math.round(timeInMs / 1000);
    },

    _getTimeInMinutes: function(timeInMs)
    {
        return Math.round(this._getTimeInSeconds(timeInMs)/60);
    },

    //Checks if all requirements has been resolved to scrobble the track.
    _trackCanBeScrobbled: function(mediaDetails, playingTime)
    {
        //is track longer than 30s

        if(mediaDetails.duration && mediaDetails.duration.getInSeconds() > 30)
        {
            //if played for 4 minutes or at least hals of its duration
            var timeInSeconds = this._getTimeInSeconds(playingTime);
            var timeInMinutes = this._getTimeInMinutes(playingTime);
            if(
                timeInMinutes > 4 ||
                (timeInSeconds > mediaDetails.duration.getInSeconds() / 2))
            {
                return true;
            }

            window.Common.Log.Instance().Warning("Cannot scrobble track.");
            window.Common.Log.Instance().Debug("Track cannot be scrobble because playing time is to short: " + timeInSeconds + "s.");
            return false;
        }
    },

    //Updates scrobbling info on last fm portal.
    //
    //A track should only be scrobbled when the following conditions have been met:
    //The track must be longer than 30 seconds.
    //And the track has been played for at least half its duration, or for 4 minutes (whichever occurs earlier.)
    _updateScrobbling: function(mediaDetails)
    {
        var playingTime = (new Date().getTime() - this._trackStartPlayingTime);

        if(this._trackCanBeScrobbled(mediaDetails, playingTime))
        {
            this._scrobbler.scrobble(
                {
                    track: mediaDetails.title,
                    artist: mediaDetails.artist,

                    timestamp: this._getTimeInSeconds(this._trackStartPlayingTime)
                },
                this._sessionObject
            );
        }
    },

    _updateNowPlaying: function(mediaDetails)
    {
        //update now playing only when new track is loaded - it prevents before reaction on pause/play events
        if(this._currentlyLoaded != mediaDetails)
        {
            this._currentlyLoaded = mediaDetails;
            this._trackStartPlayingTime = new Date().getTime();
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
            window.Player.Events.MediaPlay,
            $.proxy(function(mediaDetails)
            {
                this._updateNowPlaying(mediaDetails);
            }, this)
        );

        window.Common.EventBrokerSingleton.instance().addListener(
            window.Player.Events.MediaChanged,
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
