//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Provides possibility to scrobble music via last.fm portal.
window.LastFm.Scrobbler = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    window.Common.Log.Instance().Info("Last fm scrobbler has been created.");
}

window.LastFm.Scrobbler.prototype =
{
    //Scrobbles track with passed details.
    //Details are passed as literal: {track, artist, timestamp}.
    scrobble: function(trackDetails, session, callback)
    {
        window.Common.Log.Instance().Debug("Last fm scrobbler - scrobble request track: "+trackDetails.artist+" - "+trackDetails.track);
        this.lastFmApi.track.scrobble(
            trackDetails,
            session,
            callback);
    },

    //Updates now playing info.
    //Details are passed as literal: {track, artist}.
    updateNowPlaying: function(trackDetails, session, callback)
    {
        window.Common.Log.Instance().Debug("Last fm scrobbler - update request with track: "+trackDetails.artist+" - "+trackDetails.track);
        this.lastFmApi.track.updateNowPlaying(
            trackDetails,
            session,
            callback);
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