//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Provide easy way to get information about artist/track etc. from last.fm portal.
window.LastFm.InformationProvider = function(lastFmDataProvider)
{
    this.dataProvider = lastFmDataProvider;
    window.Common.Log.Instance().Info("Last fm information provider has been created");
}

window.LastFm.InformationProvider.prototype =
{
    getArtist: function(artistName, callback)
    {
        this.dataProvider.artist.getInfo(
            {artist: artistName},
            {success:function(data)
            {
                var artistData =
                {
                    name: data.artist.name,
                    bio: data.artist.bio.content
                };

                callback(artistData);
            }
            }
        );
    },

    getTrackDetails: function(mediaDetails, session)
    {
        window.Common.Log.Instance().Debug("Track details requested for: "+mediaDetails.toSource());
        this.dataProvider.track.getInfo(
            {
                track: mediaDetails.title,
                artist: mediaDetails.artist,
                username: session.user,
                autocorrect: 1,
                api_key: window.LastFm.LastFmConstants.API_KEY
            },
            {
                success: $.proxy(function(response)
                {
                    window.Common.Log.Instance().Debug("Track details has been obtained: "+response.toSource());
                },
                this),

                error: $.proxy(function(response)
                {
                    window.Common.Log.Instance().Debug("Track details obtaining error: "+response.toSource());
                },
                this)
            }

        )
    },

    getRecommendedArtists: function(params, session, callback){
        this.lastFmApi.user.getRecommendedArtists(params, session, callback);
    },

    getSimilar: function(params, session, callback){
        this.lastFmApi.track.getSimilar(params, callback);
    }

};
