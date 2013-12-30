//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};
window.Common = window.Common || {};
window.LastFm = window.LastFm || {};

window.ApplicationCore.OnlineScrobbler = function(sessionHandler)
{
    this._sessionHandler = sessionHandler;
    this._lastFmFactory = new window.LastFm.LastFmApiFactory();
    this._scrobbler = this._lastFmFactory.createScrobbler();

    this._trackStartPlayingTime = null;

    this._currentlyLoaded = null;
    Logger.getInstance().Info("Online scrobbler has been created.");
};

window.ApplicationCore.OnlineScrobbler.prototype =
{
    //Checks if all requirements has been resolved to scrobble the track.
    _trackCanBeScrobbled: function(mediaDetails, playingTime)
    {
        //is track longer than 30s

        if(mediaDetails && mediaDetails.duration && mediaDetails.duration.getInSeconds() > 30)
        {
            //if played for 4 minutes or at least hals of its duration
            var timeInSeconds = TimeParser.getInstance().getSeconds(playingTime);
            var timeInMinutes = TimeParser.getInstance().getMinutes(playingTime);
            if(
                timeInMinutes > 4 ||
                (timeInSeconds > mediaDetails.duration.getInSeconds() / 2))
            {
                return true;
            }
        }

        Logger.getInstance().Warning("Cannot scrobble track.");
        Logger.getInstance().Debug("Track cannot be scrobble because playing time is to short: " + timeInSeconds + "s.");
        return false;
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

                    timestamp: TimeParser.getInstance().getSeconds(this._trackStartPlayingTime)
                },
                this._sessionHandler.getSession()
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
                    artist: mediaDetails.artist,
                    duration: mediaDetails.duration.getInSeconds()
                },
                this._sessionHandler.getSession()
            );
        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(
            window.Player.Events.MediaPlay,
            $.proxy(function(mediaDetails)
            {
                this._updateNowPlaying(mediaDetails);
            }, this)
        );

        EventBroker.getInstance().addListener(
            window.Player.Events.MediaChanged,
            $.proxy(function(mediaDetails)
            {
                this._updateScrobbling(mediaDetails);
            }, this)
        );
    }
};
