//namespace
window.LastFm = window.LastFm || {};

window.LastFm.TrackLoveStateModifier = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
};

window.LastFm.TrackLoveStateModifier.prototype =
{
    //loves passed track using artist name and title.
    //details should contains:
    //      {
    //        artist,
    //        title,
    //        index
    //      }
    love: function(loveRequestDetails, session, callbacks)
    {
        var name = loveRequestDetails.details.artist+" - "+loveRequestDetails.details.track;
        Logger.getInstance().Debug("Last fm scrobbler - love request with track: " + name);
        this.lastFmApi.track.love(
            {
                track: loveRequestDetails.details.title,
                artist: loveRequestDetails.details.artist
            },
            session,
            {
                success:
                    $.proxy(function()
                        {
                            Logger.getInstance().Info("Track successfully loved.");
                            Logger.getInstance().Debug("LastFm Love details: "+ name);

                            callbacks.done(loveRequestDetails.index, loveRequestDetails.details);
                        },
                        this),

                error:
                    $.proxy(function(response)
                        {
                            Logger.getInstance().Warning("LastFm Love update failed: "+ response.message);
                            Logger.getInstance().Debug("LastFm Love failed for: "+ name);

                            callbacks.fail();
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
    unLove: function(loveRequestDetails, session, callbacks)
    {
        var name = loveRequestDetails.details.artist+" - "+loveRequestDetails.details.track;
        Logger.getInstance().Debug("Last fm scrobbler - unlove request with track: " + name);
        this.lastFmApi.track.unlove(
            {
                track: loveRequestDetails.details.title,
                artist: loveRequestDetails.details.artist
            },
            session,
            {
                success:
                    $.proxy(function()
                        {
                            Logger.getInstance().Info("Track successfully unloved.");
                            Logger.getInstance().Debug("LastFm UnLove details: "+ name);

                            callbacks.done(loveRequestDetails.index, loveRequestDetails.details);
                        },
                        this),

                error:
                    $.proxy(function(response)
                        {
                            Logger.getInstance().Warning("LastFm UnLove update failed: "+ response.message);
                            Logger.getInstance().Debug("LastFm UnLove failed for: "+ neme);

                            callbacks.fail();
                        },
                        this)
            }
        );
    }
};

