//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Provides possibility to scrobble music via last.fm portal.
window.LastFm.Scrobbler = function(lastFmApi, sessionProvider)
{
    this.lastFmApi = lastFmApi;
    this.sessionProvider = sessionProvider;
    this._eventBroker = EventBroker.getInstance();
    Logger.getInstance().info("[LastFm] Scrobbler has been created.");
};

window.LastFm.Scrobbler.prototype =
{
    _getUserUnauthorisedResponse: function()
    {
        //pass 9 as a parameter (it means that user has to re authenticate) for more details see window.LastFm.Errors
        return Promise.reject(
            {
                error: 9,
                message: window.LastFm.Errors[9]
            }
        );
    },

    _updateNowPlaying: function(mediaDetails)
    {
        if(this.sessionProvider.isSessionCreated())
        {
            var that = this;
            var requestParameters =
            {
                track: mediaDetails.title,
                artist: mediaDetails.artist.name,
                duration: mediaDetails.duration.getInSeconds()
            };

            return new Promise(function (resolve, reject)
            {
                that.lastFmApi.track.updateNowPlaying(requestParameters, that.sessionProvider.getSession(), {success: resolve, error: reject});
            });
        }

        return this._getUserUnauthorisedResponse();
    },

    _scrobble: function(mediaDetails, timestamp)
    {
        if(this.sessionProvider.isSessionCreated())
        {
            var that = this;
            var requestParameters =
            {
                track: mediaDetails.title,
                artist: mediaDetails.artist.name,
                timestamp: timestamp
            };

            return new Promise(function(resolve, reject)
            {
                that.lastFmApi.track.scrobble(requestParameters, that.sessionProvider.getSession(), {success: resolve, error: reject});
            });
        }

        return this._getUserUnauthorisedResponse();
    },

    //Scrobbles track with passed details.
    //Details are passed as literal: {track, artist, timestamp}.
    scrobble: function(mediaDetails, timestamp, callbacks)
    {
        Logger.getInstance().debug("[LastFm] Scrobbling request track: "+mediaDetails.artist.name+" - "+mediaDetails.title);
        this._scrobble(mediaDetails, timestamp).then(
            //Sample response:
            // <scrobbles accepted="1" ignored="0">
            //    <scrobble>
            //    <track corrected="0">Test Track</track>
            //    <artist corrected="0">Test Artist</artist>
            //    <album corrected="0"></album>
            //    <albumArtist corrected="0"></albumArtist>
            //    <timestamp>1287140447</timestamp>
            //    <ignoredMessage code="0"></ignoredMessage>
            //    </scrobble>
            // </scrobbles>
            function onScrobbleSuccess(response)
            {
                Logger.getInstance().info("[LastFm] Track has been scrobbled.");
                callbacks.success(mediaDetails);
            },
            function onScrobbleError(response)
            {
                Logger.getInstance().debug("[LastFm] Scrobbling failed: "+ window.LastFm.Errors[response.error]+" with message: "+response.message);
                callbacks.error();
            });
    },

    //Updates now playing info.
    //Details are passed as literal: {track, artist}.
    updateNowPlaying: function(mediaDetails, callbacks)
    {
        Logger.getInstance().debug("[LastFm] NowPlaying update request with track: "+mediaDetails.artist.name+" - "+mediaDetails.title);
        this._updateNowPlaying(mediaDetails).then(
            //example response:
            // <nowplaying>
            //     <track corrected="0">Test Track</track>
            //     <artist corrected="0">Test Artist</artist>
            //     <album corrected="0"></album>
            //     <albumArtist corrected="0"></albumArtist>
            //     <ignoredMessage code="0"></ignoredMessage>
            // </nowplaying>
            function onUpdateNowPlayingSuccess(response)
            {
                Logger.getInstance().info("[LastFm] NowPlaying has been successfully updated.");
                callbacks.success();
            },
            function onUpdateNowPlayingError(response)
            {
                Logger.getInstance().debug("[LastFm] NowPlaying failed: "+ window.LastFm.Errors[response.error]+" with message: "+response.message);
                callbacks.error();
            });
    }
};