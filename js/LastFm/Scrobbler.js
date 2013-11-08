//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Provides possibility to scrobble music via last.fm portal.
window.LastFm.Scrobbler = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    this._eventBroker = window.Common.EventBrokerSingleton.instance();
    window.Common.Log.Instance().Info("Last fm scrobbler has been created.");
};

window.LastFm.Scrobbler.prototype =
{
    //Scrobbles track with passed details.
    //Details are passed as literal: {track, artist, timestamp}.
    scrobble: function(trackDetails, session)
    {
        window.Common.Log.Instance().Debug("LastFm Scrobbling request track: "+trackDetails.artist+" - "+trackDetails.track);
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

                        window.Common.Log.Instance().Info("Track has been successfully scrobbled.");
                        window.Common.Log.Instance().Debug("LastFm Scrobbling details: "+ response.scrobbles.toSource());
                    },
                    this
                ),
                error:
                $.proxy(function(response)
                    {
                        //fire event
                        this._eventBroker.fireEventWithData(window.LastFm.Events.ScrobblingFailed, response);

                        window.Common.Log.Instance().Warning("LastFm Scrobbling update failed: "+ response.message);
                        window.Common.Log.Instance().Debug("LastFm Scrobbling failed for: "+ trackDetails.toSource());
                    },
                    this
                )
            });
    },

    //Updates now playing info.
    //Details are passed as literal: {track, artist}.
    updateNowPlaying: function(trackDetails, session)
    {
        window.Common.Log.Instance().Debug("LastFm NowPlaying update request with track: "+trackDetails.artist+" - "+trackDetails.track);
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

                        window.Common.Log.Instance().Info("Now playing has been successfully updated.");
                        window.Common.Log.Instance().Debug("LastFm NowPlaying details: "+ response.nowplaying.toSource());
                    },
                    this
                ),
                error:
                $.proxy(function(response)
                    {
                        //fire event
                        this._eventBroker.fireEventWithData(window.LastFm.Events.NowPlayingUpdateFailed, response);

                        window.Common.Log.Instance().Warning("LastFm NowPlaying update failed: "+ response.message);
                        window.Common.Log.Instance().Debug("LastFm NowPlaying failed for: "+ trackDetails.toSource());
                    },
                    this
                )
            });
    },

    //loves passed track using artist name and title.
    //details should contains:
    //      {
    //        artist,
    //        title,
    //        index
    //      }
    love: function(loveRequestDetails, session)
    {

        window.Common.Log.Instance().Debug("Last fm scrobbler - love request with track: "+loveRequestDetails.artist+" - "+loveRequestDetails.track);
        this.lastFmApi.track.love(
            {
                track: loveRequestDetails.track,
                artist: loveRequestDetails.artist
            },
            session,
            {
                success:
                    $.proxy(function(response)
                    {
                        //fire event
                        this._eventBroker.fireEventWithData(window.LastFm.Events.TrackLoved, loveRequestDetails.index);

                        window.Common.Log.Instance().Info("Track successfully loved.");
                        window.Common.Log.Instance().Debug("LastFm Love details: "+ loveRequestDetails.artist+" - "+loveRequestDetails.track);
                    },
                    this),

                error:
                    $.proxy(function(response)
                    {
                        window.Common.Log.Instance().Warning("LastFm Love update failed: "+ response.message);
                        window.Common.Log.Instance().Debug("LastFm Love failed for: "+ loveRequestDetails.artist+" - "+loveRequestDetails.track);
                    },
                    this)
            }
        );
    },

    //loves passed track using artist name and title.
    //details should contains:
    //      {
    //        artist,
    //        title,
    //        index
    //      }
    unLove: function(loveRequestDetails, session)
    {
        window.Common.Log.Instance().Debug("Last fm scrobbler - unlove request with track: "+loveRequestDetails.artist+" - "+loveRequestDetails.track);
        this.lastFmApi.track.unlove(
            {
                track: loveRequestDetails.track,
                artist: loveRequestDetails.artist
            },
            session,
            {
                success:
                    $.proxy(function(response)
                        {
                            //fire event
                            this._eventBroker.fireEventWithData(window.LastFm.Events.TrackUnloved, loveRequestDetails.index);

                            window.Common.Log.Instance().Info("Track successfully unloved.");
                            window.Common.Log.Instance().Debug("LastFm UnLove details: "+ loveRequestDetails.artist+" - "+loveRequestDetails.track);
                        },
                        this),

                error:
                    $.proxy(function(response)
                        {
                            window.Common.Log.Instance().Warning("LastFm UnLove update failed: "+ response.message);
                            window.Common.Log.Instance().Debug("LastFm UnLove failed for: "+ loveRequestDetails.artist+" - "+loveRequestDetails.track);
                        },
                        this)
            }
        );
    }
};