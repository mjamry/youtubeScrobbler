//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};

window.Player.YouTubePlaylistConstant =
{
    API_URL: "https://gdata.youtube.com/feeds/api/",
    API_VERSION: 2,
    FEED_PARAMS: "alt=jsonc&v=2",
    PLAYLIST_PARAMETER_NAME: "list",
    VIDEO_PARAMETER_NAME: "v",
    PLAYLIST_API_VALUE: "playlists/",
    VIDEOS_API_VALUE: "videos/",
    VIDEO_TITLE_ID: 1,
    ARTIST_NAME_ID: 0,
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

        Logger.getInstance().Warning("Error occurs while parsing title.");
        Logger.getInstance().Debug("Incorrect naming pattern: "+details);
        return null;
    },

    //gets details for specified clip.
    //if cannot retrieve details returns "undefined";
    //TODO - handle errors while parsing video details recieved from YT. It is possible that video has been deleted.
    _getMediaDetails: function(media)
    {
        Logger.getInstance().Debug("Recieved YouTube details for media: "+media.title);
        var mediaDetails = new window.Player.MediaDetails();

        mediaDetails.mediaType = window.Player.YouTubePlaylistConstant.MEDIA_TYPE;
        mediaDetails.duration = new window.Player.Duration(media.duration);

        var trackName = this._splitTitle(media.title);

        //sometime media.player is empty - do not know why...
        if(!media.player || !trackName)
        {
            Logger.getInstance().Warning("Cannot read media details.");
            Logger.getInstance().Debug("Probably file does not exist anymore: "+media.title);
            return null;
        }

        mediaDetails.artist = trackName.artist;
        mediaDetails.title = trackName.title;
        mediaDetails.url = media.player.default;

        return mediaDetails;
    },

    //gets playlist using playlist id. When finished it calls callback function to return data.
    _createPlaylist : function(id, callback)
    {
        var url = window.Player.YouTubePlaylistConstant.API_URL +
            window.Player.YouTubePlaylistConstant.PLAYLIST_API_VALUE +
            id +
            window.Common.UrlParserConstants.PARAMS_START_SIGN +
            window.Player.YouTubePlaylistConstant.FEED_PARAMS;

        $.getJSON(url, $.proxy(function(result)
        {
           var playlist = new window.Player.Playlist();
           var list = result.data.items;
           for(var i=0;i<list.length;i++)
           {
                var mediaDetails = this._getMediaDetails(list[i].video);

                if(mediaDetails !== null)
                {
                    playlist.add(mediaDetails);
                }
           }

           callback(playlist);
        }, this));
    },
            
    //gets video data using id. When finished it calls callback function to return data.
    _loadVideo : function(id, callback)
    {
        var url = window.Player.YouTubePlaylistConstant.API_URL +
            window.Player.YouTubePlaylistConstant.VIDEOS_API_VALUE +
            id +
            window.Common.UrlParserConstants.PARAMS_START_SIGN +
            window.Player.YouTubePlaylistConstant.FEED_PARAMS;

        $.getJSON(url, $.proxy(function(result)
        {
            var mediaDetails = this._getMediaDetails(result.data);

            var playlist = new window.Player.Playlist();

            if(mediaDetails !== null)
            {
                playlist.add(mediaDetails);
            }

            //TODO what if playlist is empty?
			callback(playlist);
           
        }, this));
    },
    
    //parses specified url address (form YT). Depending on url structure it loads playlist or single video.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    loadPlaylistFromUrl : function(url, callback)
    {
        Logger.getInstance().Debug("Sending request to YouTube. Url: "+url);
        var parser = new window.Common.UrlParser();
        var playlistId = parser.getParameterValue(url, window.Player.YouTubePlaylistConstant.PLAYLIST_PARAMETER_NAME);
        
        if(playlistId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
        {
            this._createPlaylist(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, window.Player.YouTubePlaylistConstant.VIDEO_PARAMETER_NAME);
            if(videoId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
            {
                this._loadVideo(videoId, callback);
            }
        }
    }
};
