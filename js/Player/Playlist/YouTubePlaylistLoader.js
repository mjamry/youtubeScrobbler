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
	_getArtist: function(videoName)
	{
        var index = window.Player.YouTubePlaylistConstant.ARTIST_NAME_ID;
		var vidName = videoName.split(window.Player.YouTubePlaylistConstant.VIDEO_NAME_SEPARATOR);
		vidName[index] = vidName[index].trim();
		return vidName[index];
	},
			
	_getTitle: function(videoName)
	{
        var index = window.Player.YouTubePlaylistConstant.VIDEO_TITLE_ID;
		var vidName = videoName.split(window.Player.YouTubePlaylistConstant.VIDEO_NAME_SEPARATOR);
		vidName[index] = vidName[index].trim();
		return vidName[index];
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
               var mediaDetails = new window.Player.MediaDetails();
               mediaDetails.artist = this._getArtist(list[i].video.title);
               mediaDetails.title = this._getTitle(list[i].video.title);
               mediaDetails.id = list[i].video.id;
               mediaDetails.url = list[i].video.player.default;
               mediaDetails.mediaType = window.Player.YouTubePlaylistConstant.MEDIA_TYPE;
               mediaDetails.duration = new window.Player.Duration(list[i].video.duration);

               playlist.add(mediaDetails);
           }

           window.Common.Log.Instance().Info("Playlist loaded, has "+playlist.lenght()+" objects.");
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
            var mediaDetails = new window.Player.MediaDetails();
            mediaDetails.artist = this._getArtist(result.data.title);
            mediaDetails.title = this._getTitle(result.data.title);
            mediaDetails.id = result.data.id;
            mediaDetails.url = result.data.player.default;
            mediaDetails.mediaType = window.Player.YouTubePlaylistConstant.MEDIA_TYPE;
            mediaDetails.duration = new window.Player.Duration(result.data.duration);

            var playlist = new window.Player.Playlist();
            playlist.add(mediaDetails);

			callback(playlist);
           
        }, this));
    },
    
    //parses specified url addres (form YT). Depending on url structure it loads playlist or single video.
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
