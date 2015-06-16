//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Provide easy way to get information about artist/track etc. from last.fm portal.
window.LastFm.LastFmTrackInformationProvider = function(lastFmDataProvider, sessionProvider)
{
    this.innerRepository = lastFmDataProvider;
    this.sessionProvider = sessionProvider;
    Logger.getInstance().info("[LastFm] Information provider has been created");
};

window.LastFm.LastFmTrackInformationProvider.prototype =
{
    // Example response:
    //    <track>
    //        <id>1019817</id>
    //        <name>Believe</name>
    //        <mbid/>
    //        <url>http://www.last.fm/music/Cher/_/Believe</url>
    //        <duration>240000</duration>
    //        <streamable fulltrack="1">1</streamable>
    //        <listeners>69572</listeners>
    //        <playcount>281445</playcount>
    //        <artist>
    //            <name>Cher</name>
    //            <mbid>bfcc6d75-a6a5-4bc6-8282-47aec8531818</mbid>
    //            <url>http://www.last.fm/music/Cher</url>
    //        </artist>
    //        <album position="1">
    //            <artist>Cher</artist>
    //            <title>Believe</title>
    //            <mbid>61bf0388-b8a9-48f4-81d1-7eb02706dfb0</mbid>
    //            <url>http://www.last.fm/music/Cher/Believe</url>
    //            <image size="small">http://userserve-ak.last.fm/serve/34/8674593.jpg</image>
    //            <image size="medium">http://userserve-ak.last.fm/serve/64/8674593.jpg</image>
    //            <image size="large">http://userserve-ak.last.fm/serve/126/8674593.jpg</image>
    //        </album>
    //        <toptags>
    //            <tag>
    //                <name>pop</name>
    //                <url>http://www.last.fm/tag/pop</url>
    //            </tag>
    //        ...
    //        </toptags>
    //        <wiki>
    //            <published>Sun, 27 Jul 2008 15:44:58 +0000</published>
    //            <summary>...</summary>
    //            <content>...</content>
    //        </wiki>
    //    </track>
    _standardiseTrackDetails: function(trackDetails)
    {
        var mediaDetails = new window.Player.MediaDetails();

        mediaDetails.title = trackDetails.track.name;
        mediaDetails.mbid = trackDetails.track.mbid;
        mediaDetails.id = trackDetails.track.id;

        mediaDetails.artist = new window.Player.ArtistDetails(
            {
                name: trackDetails.track.artist.name,
                mbid: trackDetails.track.artist.mbid,
                url: trackDetails.track.artist.url
            }
        );

        if(trackDetails.track.album)
        {
            mediaDetails.album = new window.Player.AlbumDetails(
                {
                    name: trackDetails.track.album.title,
                    mbid: trackDetails.track.album.mbid,
                    url: trackDetails.track.album.url,
                    cover: trackDetails.track.album.image[0]["#text"]
                }
            );
        }

        if(trackDetails.track.toptags)
        {
            mediaDetails.tags = trackDetails.track.toptags.tag;
        }

        mediaDetails.loved = trackDetails.track.userloved == "1";

        return mediaDetails;
    },

    _getTrackDetails: function(mediaDetails)
    {
        var that = this;
        var session = this.sessionProvider.getSession();

        var requestParameters =
        {
            track: mediaDetails.title,
            artist: mediaDetails.artist.name,
            username: session.name,
            autocorrect: 1,
            api_key: window.LastFm.LastFmConstants.API_KEY
        };

        return new Promise(function(resolve, reject)
        {
            Logger.getInstance().debug("[LastFm] Track details requested for: "+mediaDetails.artist.name +" - "+mediaDetails.title);
            that.innerRepository.track.getInfo(requestParameters, {success: resolve, error: reject});
        });

    },

    getTrackDetails: function(mediaDetails, callbacks)
    {
        var that = this;
        this._getTrackDetails(mediaDetails).then(
            function onGetTrackDetailsSuccess(trackDetails)
            {
                Logger.getInstance().debug("[LastFm] Track details has been obtained: "+mediaDetails.artist.name +" - "+mediaDetails.title);
                callbacks.done(that._standardiseTrackDetails(trackDetails));
            },
            function onGetTrackDetailsError(response)
            {
                Logger.getInstance().warning("[LastFm] Track details obtaining error: " +window.LastFm.Errors[response]);
                callbacks.fail();
            });
    }
};
