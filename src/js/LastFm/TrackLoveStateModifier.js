//namespace
window.LastFm = window.LastFm || {};

window.LastFm.TrackLoveStateModifier = function(lastFmApi, sessionProvider)
{
    this.lastFmApi = lastFmApi;
    this.sessionProvider = sessionProvider;
};

window.LastFm.TrackLoveStateModifier.prototype =
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

    _love: function(mediaDetails)
    {
        if(this.sessionProvider.isSessionCreated())
        {
            var that = this;
            var requestParameters =
            {
                track: mediaDetails.title,
                artist: mediaDetails.artist.name
            };

            return new Promise(function(resolve, reject)
            {
                that.lastFmApi.track.love(requestParameters, that.sessionProvider.getSession(), {success: resolve, error: reject});
            });
        }

        return this._getUserUnauthorisedResponse();
    },

    _unLove: function(mediaDetails)
    {
        if(this.sessionProvider.isSessionCreated())
        {
            var that = this;
            var requestParameters =
            {
                track: mediaDetails.title,
                artist: mediaDetails.artist.name
            };

            return new Promise(function(resolve, reject)
            {
                that.lastFmApi.track.unlove(requestParameters, that.sessionProvider.getSession(), {success: resolve, error: reject});
            });
        }

        return this._getUserUnauthorisedResponse();
    },

    love: function(mediaDetails,  callbacks)
    {
        Logger.getInstance().debug("[LastFm] Love request for track: " + mediaDetails.artist.name+" - "+mediaDetails.title);
        this._love(mediaDetails).then(
            function onLoveSuccess()
            {
                Logger.getInstance().info("[LastFm] Track has been loved.");
                callbacks.success();
            },
            function onLoveError(response)
            {
                Logger.getInstance().warning("LastFm Love update failed: "+ window.LastFm.Errors[response.error]+" with message: "+response.message);
                callbacks.error();
            });
    },

    unLove: function(mediaDetails, callbacks)
    {
        Logger.getInstance().debug("[LastFm] Unlove request with track: " + mediaDetails.artist.name+" - "+mediaDetails.title);
        this._unLove(mediaDetails).then(
            function onUnLoveSuccess()
            {
                Logger.getInstance().info("[LastFM] Track has been unloved.");
                callbacks.success();
            },
            function onUnLoveError(response)
            {
                Logger.getInstance().warning("[LastFm] Unlove update failed: "+ window.LastFm.Errors[response.error]+" with message: "+response.message);
                callbacks.error();
            });
    }
};