//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};
window.Common = window.Common || {};
window.LastFm = window.LastFm || {};

window.ApplicationCore.OnlineScrobbler = function(scrobbler)
{
    this._scrobbler = scrobbler;

    this._trackStartPlayingTime = null;

    this._currentlyLoaded = null;
    Logger.getInstance().info("Scrobbler has been created.");
};

window.ApplicationCore.OnlineScrobbler.prototype =
{
    //Checks if all requirements has been resolved to scrobble the track.
    _trackCanBeScrobbled: function(mediaDetails, startTime)
    {
        //check if there was any track previously played
        if(startTime)
        {
            var timeInSeconds = 0;
            //is track longer than 30s
            if (mediaDetails && mediaDetails.duration && mediaDetails.duration.getInSeconds() > 30) {
                //calculate playing time
                var playingTime = (new Date().getTime() - startTime);

                //if played for 4 minutes or at least hals of its duration
                timeInSeconds = TimeParser.getInstance().getSeconds(playingTime);
                var timeInMinutes = TimeParser.getInstance().getMinutes(playingTime);
                if (
                    timeInMinutes > 4 ||
                    (timeInSeconds > mediaDetails.duration.getInSeconds() / 2)) {
                    return true;
                }
            }
            var msg = "Cannot scrobble track, because playing time was to short: " + timeInSeconds + "s.";
            Logger.getInstance().warning("[Scrobbler] " + msg);
            UserNotifier.getInstance().error("Cannot scrobble track, because playing time was to short: " + timeInSeconds + "s.");
        }
        return false;
    },

    //Updates scrobbling info on last fm portal.
    //
    //A track should only be scrobbled when the following conditions have been met:
    //The track must be longer than 30 seconds.
    //And the track has been played for at least half its duration, or for 4 minutes (whichever occurs earlier.)
    _updateScrobbling: function(mediaDetails)
    {
        if(this._trackCanBeScrobbled(mediaDetails, this._trackStartPlayingTime))
        {
            this._scrobbler.scrobble(
                {
                    track: mediaDetails.title,
                    artist: mediaDetails.artist.name,

                    timestamp: TimeParser.getInstance().getSeconds(this._trackStartPlayingTime)
                }
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
                mediaDetails,
                {
                    success: function(){},
                    error: function(){}
                }
            );
        }
    },

    _handleMediaStopped: function()
    {
        //clear this value to avoid unwanted scrobbling of (broken) track
        this._trackStartPlayingTime = null;
    },

    _handlePlaylistCleared: function()
    {
        this._trackStartPlayingTime = null;
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
            $.proxy(function(args)
            {
                this._updateScrobbling(args.previous);
            }, this)
        );

        //clear track playing timeout
        EventBroker.getInstance().addListener(window.Player.Events.MediaStopped, $.proxy(this._handleMediaStopped, this));
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCleared, $.proxy(this._handlePlaylistCleared, this));
    }
};
