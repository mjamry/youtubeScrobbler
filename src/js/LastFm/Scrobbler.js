//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Provides possibility to scrobble music via last.fm portal.
window.LastFm.Scrobbler = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    this._eventBroker = EventBroker.getInstance();
    Logger.getInstance().Info("Last fm scrobbler has been created.");
};

window.LastFm.Scrobbler.prototype =
{
    //Scrobbles track with passed details.
    //Details are passed as literal: {track, artist, timestamp}.
    scrobble: function(trackDetails, session)
    {
        Logger.getInstance().Debug("LastFm Scrobbling request track: "+trackDetails.artist+" - "+trackDetails.track);
        this.lastFmApi.track.scrobble(
            trackDetails,
            session,
            {

                /*Sample response:
                <scrobbles accepted="1" ignored="0">
                  <scrobble>
                    <track corrected="0">Test Track</track>
                    <artist corrected="0">Test Artist</artist>
                    <album corrected="0"></album>
                    <albumArtist corrected="0"></albumArtist>
                    <timestamp>1287140447</timestamp>
                    <ignoredMessage code="0"></ignoredMessage>
                  </scrobble>
                </scrobbles>*/
                success:
                $.proxy(function(response)
                    {
                        //fire event
                        this._eventBroker.fireEventWithData(window.LastFm.Events.TrackScrobbled, response);

                        Logger.getInstance().Info("Track has been successfully scrobbled.");
                        Logger.getInstance().Debug("LastFm Scrobbling details: "+ trackDetails.artist+" - "+trackDetails.track);
                    },
                    this
                ),
                error:
                $.proxy(function(response)
                    {
                        //fire event
                        this._eventBroker.fireEventWithData(window.LastFm.Events.ScrobblingFailed, response);

                        Logger.getInstance().Warning("LastFm Scrobbling update failed: "+ response.message);
                        Logger.getInstance().Debug("LastFm Scrobbling failed for: "+ trackDetails.artist+" - "+trackDetails.track);
                    },
                    this
                )
            });
    },

    //Updates now playing info.
    //Details are passed as literal: {track, artist}.
    updateNowPlaying: function(trackDetails, session)
    {
        Logger.getInstance().Debug("LastFm NowPlaying update request with track: "+trackDetails.artist+" - "+trackDetails.track);
        this.lastFmApi.track.updateNowPlaying(
            trackDetails,
            session,
            {
                /*example response:
                <nowplaying>
                    <track corrected="0">Test Track</track>
                    <artist corrected="0">Test Artist</artist>
                    <album corrected="0"></album>
                    <albumArtist corrected="0"></albumArtist>
                    <ignoredMessage code="0"></ignoredMessage>
                </nowplaying>*/
                success:
                $.proxy(function(response)
                    {
                        //fire event
                        this._eventBroker.fireEventWithData(window.LastFm.Events.NowPlayingUpdated, response);

                        Logger.getInstance().Info("Now playing has been successfully updated.");
                        Logger.getInstance().Debug("LastFm NowPlaying details: "+ trackDetails.artist+" - "+trackDetails.track);
                    },
                    this
                ),
                error:
                $.proxy(function(response)
                    {
                        //fire event
                        this._eventBroker.fireEventWithData(window.LastFm.Events.NowPlayingUpdateFailed, response);

                        Logger.getInstance().Warning("LastFm NowPlaying update failed: "+ response.message);
                        Logger.getInstance().Debug("LastFm NowPlaying failed for: "+ trackDetails.artist+" - "+trackDetails.track);
                    },
                    this
                )
            });
    }
};