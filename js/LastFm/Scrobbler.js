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
}

window.LastFm.Scrobbler.prototype =
{
    //Scrobbles track with passed details.
    //Details are passed as literal: {track, artist, timestamp}.
    scrobble: function(trackDetails, session)
    {
        window.Common.Log.Instance().Debug("Last fm scrobbler - scrobble request track: "+trackDetails.artist+" - "+trackDetails.track);
        this.lastFmApi.track.scrobble(
            trackDetails,
            session,
            {

                //Sample response:
                //<scrobbles accepted="1" ignored="0">
                //  <scrobble>
                //    <track corrected="0">Test Track</track>
                //    <artist corrected="0">Test Artist</artist>
                //    <album corrected="0"></album>
                //    <albumArtist corrected="0"></albumArtist>
                //    <timestamp>1287140447</timestamp>
                //    <ignoredMessage code="0"></ignoredMessage>
                //  </scrobble>
                //</scrobbles>
                success: $.proxy(
                    function(response)
                    {
                        this._eventBroker.fireEventWithData(window.LastFm.Events.ScrobbleUpdated, response);
                        window.Common.Log.Instance().Info("Scrobbling new track.");
                        window.Common.Log.Instance().Debug("LastFm Scrobbling details: "+ response.scrobbles.scrobble.track);
                        return { isSuccessful: true };
                    }, this),
                error: $.proxy(
                    function(response)
                    {
                        window.Common.Log.Instance().Error("LastFm Scrobbling update failed: "+ response.message);
                        return {isSuccessful: false, err: response.message};
                    }, this)
            });
    },

    //Updates now playing info.
    //Details are passed as literal: {track, artist}.
    updateNowPlaying: function(trackDetails, session, callback)
    {
        window.Common.Log.Instance().Debug("Last fm scrobbler - update request with track: "+trackDetails.artist+" - "+trackDetails.track);
        this.lastFmApi.track.updateNowPlaying(
            trackDetails,
            session,
            {
                success:  function(response)
                {
                    window.Common.Log.Instance().Info("LastFm NowPlaying successfuly updated: "+ response.nowplaying.track);
                },
                error: function(e)
                {
                    window.Common.Log.Instance().Error("LastFm NowPlaying update failed: "+ e.message);
                }
            });
    },

    love: function(trackDetails, session, callback)
    {
        window.Common.Log.Instance().Debug("Last fm scrobbler - love request with track: "+trackDetails.artist+" - "+trackDetails.track);
        this.lastFmApi.track.love(
            trackDetails,
            session,
            callback
        );
    }
};