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
    MEDIA_TYPE: "video/youtube"
};

//Main responsibility is to create playlists depending upon specified url address.
window.Player.YouTubePlaylistLoader = function(){};

window.Player.YouTubePlaylistLoader.prototype =
{
    //TODO use regex instead
	_getArtist: function(videoName)
	{
        var index = window.Player.YouTubePlaylistConstant.ARTIST_NAME_ID;
		var vidName = videoName.split(window.Player.YouTubePlaylistConstant.VIDEO_NAME_SEPARATOR);

        var result = "";
        try
        {
            result = vidName[index].trim();
        }
        catch(e)
        {
            window.Common.Log.Instance().Error("Error occurs while parsing artist.");
            window.Common.Log.Instance().Debug("Incorrect naming pattern: "+videoName);
        }
        return result;
	},
			
	_getTitle: function(videoName)
	{
        var index = window.Player.YouTubePlaylistConstant.VIDEO_TITLE_ID;
		var vidName = videoName.split(window.Player.YouTubePlaylistConstant.VIDEO_NAME_SEPARATOR);
        var result = "";
        try
        {
            result = vidName[index].trim();
        }
        catch(e)
        {
            window.Common.Log.Instance().Error("Error occurs while parsing title.");
            window.Common.Log.Instance().Debug("Incorrect naming pattern: "+videoName);
        }
		return result;
	},

    //gets details for specified clip.
    //if cannot retrieve details returns "undefined";
    _getMediaDetails: function(media)
    {
        var mediaDetails = new window.Player.MediaDetails();
        mediaDetails.artist = this._getArtist(media.title);
        mediaDetails.title = this._getTitle(media.title);
        mediaDetails.id = media.id;
        mediaDetails.url = media.player.default;
        mediaDetails.mediaType = window.Player.YouTubePlaylistConstant.MEDIA_TYPE;
        mediaDetails.duration = new window.Player.Duration(media.duration);

        if(mediaDetails.artist == "" || mediaDetails.title == "")
        {
            return null;
        }

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

        window.Common.Log.Instance().Debug("Sending playlist load request: "+url);
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

           window.Common.Log.Instance().Info("Playlist loaded, has "+playlist.length()+" objects.");
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

        window.Common.Log.Instance().Debug("Sending video load request: "+url);
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
