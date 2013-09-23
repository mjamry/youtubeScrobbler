//namespace
window.Common = window.Common || {};

YouTubePlaylistConstant =
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
    VIDEO_NAME_SEPARATOR: "-"
}

//Main responsibility is to create playlists depending upon specified url address.
window.Common.YouTubePlaylistLoader = function(){}

window.Common.YouTubePlaylistLoader.prototype =
{
    ///change length in seconds to human readible format, containing minutes and seconds.
	_getHumanReadibleTimeFormat: function(timeInSeconds)
	{
		var minuteInSeconds = 60;
		var min = parseInt(timeInSeconds / minuteInSeconds);
		var sec = timeInSeconds % minuteInSeconds;

		return min + ":" + (sec < 10 ? "0" + sec : sec);
	},
			
	_getArtist: function(videoName)
	{
		var vidName = videoName.split(YouTubePlaylistConstant.VIDEO_NAME_SEPARATOR);
		vidName[YouTubePlaylistConstant.ARTIST_NAME_ID] = vidName[YouTubePlaylistConstant.ARTIST_NAME_ID].trim();
		return vidName[YouTubePlaylistConstant.ARTIST_NAME_ID];
	},
			
	_getTitle: function(videoName)
	{
		var vidName = videoName.split(YouTubePlaylistConstant.VIDEO_NAME_SEPARATOR);
		vidName[YouTubePlaylistConstant.VIDEO_TITLE_ID] = vidName[YouTubePlaylistConstant.VIDEO_TITLE_ID].trim();
		return vidName[YouTubePlaylistConstant.VIDEO_TITLE_ID];
	},
	
    //gets playlist using playlist id. When finished it calls callback function to return data.
    _createPlaylist : function(id, callback)
    {
        var url = YouTubePlaylistConstant.API_URL + YouTubePlaylistConstant.PLAYLIST_API_VALUE + id + UrlParserConstants.PARAMS_START_SIGN +YouTubePlaylistConstant.FEED_PARAMS;
        window.Common.Log.Instance().Debug("Sending playlist load request: "+url);
        $.getJSON(url, function(result)
        {
           var videosList = [];
           var list = result.data.items;
           for(var i=0;i<list.length;i++)
           {
               videosList.push({id:list[i].video.id, title:list[i].video.title});
           }
           
           var playlist = 
           {
               title: result.data.title,
               videos: videosList
           };
           
           callback(playlist);
        });
    },
            
    //gets video data using id. When finished it calls callback function to return data.
    loadVideo : function(id, callback)
    {
        var url = YouTubePlaylistConstant.API_URL + YouTubePlaylistConstant.VIDEOS_API_VALUE + id + UrlParserConstants.PARAMS_START_SIGN + YouTubePlaylistConstant.FEED_PARAMS;
        window.Common.Log.Instance().Debug("Sending video load request: "+url);
        $.getJSON(url, $.proxy(function(result)
        {
			var duration = this._getHumanReadibleTimeFormat(result.data.duration);
			var playlist = 
			{
				title: result.data.title,
				videos: [
					{
						id: result.data.id, 
						artist: this._getArtist(result.data.title),
						title: this._getTitle(result.data.title),
						name: result.data.title,
						durationInSeconds: result.data.duration,
						durationInMinutes: duration
					}
				]
			};
			callback(playlist);
           
        }, this));
    },
    
    //parses specified url addres (form YT). Depending on url structure it loads playlist or single video.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    loadPlaylistFromUrl : function(url, callback)
    {
        var parser = new window.Common.UrlParser();
        var playlistId = parser.getParameterValue(url, YouTubePlaylistConstant.PLAYLIST_PARAMETER_NAME);
        
        if(playlistId !== UrlParserConstants.URL_PARSE_ERR)
        {
            this._createPlaylist(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, YouTubePlaylistConstant.VIDEO_PARAMETER_NAME);
            if(videoId !== UrlParserConstants.URL_PARSE_ERR)
            {
                this.loadVideo(videoId, callback);
            }
        }
    }
};
