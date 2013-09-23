//namespace
window.LastFm = window.LastFm || {};

//Provide easy way to get information about artist/track etc. from last.fm portal.
window.LastFm.InformationProvider = function(lastFmDataProvider)
{
    this.dataProvider = lastFmDataProvider;
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

    getTack: function(trackName)
    {

    },

    getRecommendedArtists: function(params, session, callback){
        this.lastFmApi.user.getRecommendedArtists(params, session, callback);
    },

    getSimilar: function(params, session, callback){
        this.lastFmApi.track.getSimilar(params, callback);
    }

};
