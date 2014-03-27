//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};

window.Player.YouTubePlaylistConstant =
{
    API_URL: "https://gdata.youtube.com/feeds/api/",
    API_VERSION: 2,
    FEED_PARAMS: "alt=jsonc&v=2",
    FEED_QUANTITY_PARAMS: "&max-results=50&start-index=",
    PLAYLIST_PARAMETER_NAME: "list",
    VIDEO_PARAMETER_NAME: "v",
    PLAYLIST_API_VALUE: "playlists/",
    VIDEOS_API_VALUE: "videos/",
    VIDEO_TITLE_ID: 1,
    ARTIST_NAME_ID: 0,
    MAX_NUMBER_OF_RESULTS: 50,
    VIDEO_NAME_SEPARATOR: "-",
    MEDIA_TYPE: "video/youtube",
    REGEX_NAMING_PATTERN: "([^\\-]*)-\\s?((?:[^\\{\\}\\(\\)\\[\\]]?)*)(.*)"
};

//Main responsibility is to create playlists depending upon specified url address.
window.Player.YouTubePlaylistLoader = function(){};

window.Player.YouTubePlaylistLoader.prototype =
{
    _splitTitle: function(details)
    {
        var namePattern = RegExp(window.Player.YouTubePlaylistConstant.REGEX_NAMING_PATTERN);
        var names = namePattern.exec(details);

        if(names)
        {
            return {
                artist: names[1],
                title: names[2]
            };
        }

        throw("[YT] Error occurs while parsing title. Incorrect naming pattern: "+details);
    },

    //gets details for specified clip.
    //if cannot retrieve details returns "undefined";
    //TODO - handle errors while parsing video details received from YT. It is possible that video has been deleted.
    _getMediaDetails: function(media)
    {
        Logger.getInstance().Debug("[YT] Received details for media: "+media.title);
        var mediaDetails = new window.Player.MediaDetails();

        mediaDetails.mediaType = window.Player.YouTubePlaylistConstant.MEDIA_TYPE;
        mediaDetails.duration = new window.Player.Duration(media.duration);

        var trackName = this._splitTitle(media.title);

        //sometime media.player is empty - do not know why...
        if(!media.player)
        {
            throw("[YT] Cannot read media details. Probably file does not exist anymore: "+media.title);
        }

        mediaDetails.artist = new window.Player.ArtistDetails(
            {
                name: trackName.artist,
                mbid: "",
                url: "",
                cover: ""
            }
        );

        mediaDetails.title = trackName.title;
        mediaDetails.url = media.player.default;

        return mediaDetails;
    },

    //creates playlist using details obtained from youtube
    _createPlaylist: function(list)
    {
        var playlist = new window.Player.Playlist();
        for (var i = 0; i < list.length; i++)
        {
            //TODO - it is only temporary needed for debugging
            if(list[i].video.restrictions)
            {
                var restr = list[i].video.restrictions;
                Logger.getInstance().Debug("[YT] Playback restrictions: "+restr.length+" | relationship: "+restr[0].relationship+" | type: "+restr[0].type+" | countries: "+restr[0].countries);
            }
            var mediaDetails = null;
            try
            {
                mediaDetails = this._getMediaDetails(list[i].video);
            }
            catch(e)
            {
                Logger.getInstance().Warning(e);
            }

            if (mediaDetails !== null)
            {
                playlist.addItem(mediaDetails);
            }
        }

        return playlist;
    },

    //gets playlist using playlist id. When finished it calls callback function to return data.
    _obtainPlaylistDetails : function(id, callback)
    {
        var playlist = new window.Player.Playlist();
        var url = window.Player.YouTubePlaylistConstant.API_URL +
            window.Player.YouTubePlaylistConstant.PLAYLIST_API_VALUE +
            id +
            window.Common.UrlParserConstants.PARAMS_START_SIGN +
            window.Player.YouTubePlaylistConstant.FEED_PARAMS +
            window.Player.YouTubePlaylistConstant.FEED_QUANTITY_PARAMS;

        //TODO i belieave that it can be done in better way
        (function __obtainPlaylistDetails(playlist, callback, that)
        {
            return function getPlaylistFromYoutube(startingIndex)
            {
                var endIndex = startingIndex + window.Player.YouTubePlaylistConstant.MAX_NUMBER_OF_RESULTS;
                //startingIndex++;
                Logger.getInstance().Debug("[YT] Playlist details request for items in range: "+startingIndex+" - "+endIndex);
                $.getJSON(url+startingIndex, function(result)
                {
                    if(result.data.items)
                    {
                        var list = result.data.items;
                        playlist.addPlaylist(that._createPlaylist(list));

                        //check if all videos details are obtained if not increment start_index and call this function once again
                        //at the end call callback passing created playlist
                        if(result.data.items.length >= window.Player.YouTubePlaylistConstant.MAX_NUMBER_OF_RESULTS)
                        {
                            getPlaylistFromYoutube(endIndex);
                        }
                        else
                        {
                            callback(playlist);
                        }
                    }
                });
            };
        })(playlist, callback, this)(1);
    },
            
    //gets video data using id. When finish it calls callback function to return data.
    _obtainVideoDetails : function(id, callback)
    {
        var playlist = null;
        var url = window.Player.YouTubePlaylistConstant.API_URL +
            window.Player.YouTubePlaylistConstant.VIDEOS_API_VALUE +
            id +
            window.Common.UrlParserConstants.PARAMS_START_SIGN +
            window.Player.YouTubePlaylistConstant.FEED_PARAMS;

        Logger.getInstance().Debug("[YT] Video details request");
        $.getJSON(url, $.proxy(function(result)
        {
            //create a table from result
            playlist = this._createPlaylist([{video:result.data}]);
            //TODO what if playlist is empty?
            callback(playlist);
        },
        this));
    },
    
    //parses specified url address (form YT). Depending on url structure it loads playlist or single video.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    //playlist is returned via callback function
    loadPlaylistFromUrl : function(url, callback)
    {
        Logger.getInstance().Debug("[YT] Sending data request for url: "+url);
        var parser = new window.Common.UrlParser();
        var playlistId = parser.getParameterValue(url, window.Player.YouTubePlaylistConstant.PLAYLIST_PARAMETER_NAME);
        
        if(playlistId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
        {
            this._obtainPlaylistDetails(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, window.Player.YouTubePlaylistConstant.VIDEO_PARAMETER_NAME);
            if(videoId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
            {
                this._obtainVideoDetails(videoId, callback);
            }
        }
    }
};
