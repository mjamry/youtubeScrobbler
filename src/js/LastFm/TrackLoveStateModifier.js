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
        var name = loveRequestDetails.details.artist.name+" - "+loveRequestDetails.details.title;
        Logger.getInstance().debug("Last fm scrobbler - love request with track: " + name);
        this.lastFmApi.track.love(
            {
                track: loveRequestDetails.details.title,
                artist: loveRequestDetails.details.artist.name
            },
            session,
            {
                success:
                    $.proxy(function()
                        {
                            var msg = "'"+loveRequestDetails.details.artist.name+" - "+loveRequestDetails.details.title+"' has been loved.";
                            Logger.getInstance().info(msg);
                            UserNotifier.getInstance().info(msg);
                            callbacks.success(loveRequestDetails.index, loveRequestDetails.details);
                        },
                        this),

                error:
                    $.proxy(function(response)
                        {
                            Logger.getInstance().warning("LastFm Love update failed: "+ response.message);
                            Logger.getInstance().debug("LastFm Love failed for: "+ name);

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
        var name = loveRequestDetails.details.artist.name+" - "+loveRequestDetails.details.title;
        Logger.getInstance().debug("Last fm scrobbler - unlove request with track: " + name);
        this.lastFmApi.track.unlove(
            {
                track: loveRequestDetails.details.title,
                artist: loveRequestDetails.details.artist.name
            },
            session,
            {
                success:
                    $.proxy(function()
                        {
                            var msg = "'"+loveRequestDetails.details.artist.name+" - "+loveRequestDetails.details.title+"' has been unloved.";
                            Logger.getInstance().info(msg);
                            UserNotifier.getInstance().info(msg);
                            callbacks.success(loveRequestDetails.index, loveRequestDetails.details);
                        },
                        this),

                error:
                    $.proxy(function(response)
                        {
                            Logger.getInstance().warning("LastFm UnLove update failed: "+ response.message);
                            Logger.getInstance().debug("LastFm UnLove failed for: "+ name);

                            callbacks.fail();
                        },
                        this)
            }
        );
    }
};

