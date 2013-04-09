//Class used to create playlist depending upon specified url address.
function playlistLoader(){
    this.params = {
        playlist : "list",
        video : "v"
    };
    this.ytApiUrl = "https://gdata.youtube.com/feeds/api/";
    this.apiVersion = 2;
    this.ytFeedParams = "alt=jsonc&v=2";
 }

playlistLoader.prototype = 
{
    //gets playlist using playlist id. When finished it calls callback function to return data.
    _createPlaylist : function(id, callback)
    {
        var url = this.ytApiUrl+"playlists/"+id+"?"+this.ytFeedParams;
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
            
    _createPlaylistFromVideo: function(id, callback)
    {
        var callb = function(params)
        {
            var playlist = {
                title: params.title,
                videos: [
                    {
                        id: params.id,
                        title: params.title
                    }
            
                ]
            };
            
            return playlist;
        };
        
        
    },
            
    //gets video data using id. When finished it calls callback function to return data.
    loadVideo : function(id, callback)
    {
        var url = this.ytApiUrl+"videos/"+id+"?"+this.ytFeedParams;
        $.getJSON(url, function(result)
        {
			var minuteInSeconds = 60;
			var min = parseInt(result.data.duration/minuteInSeconds);
			var sec = result.data.duration%minuteInSeconds;
			
			var duration = min+":"+(sec < 10 ? "0"+sec : sec);
			var playlist = 
			{
				title: result.data.title,
				videos: [
					{
						id: result.data.id, 
						title: result.data.title,
						durationInSeconds: result.data.duration,
						durationInMinutes: duration
					}
				]
			};
			callback(playlist);
           
        });
    },
    
    //parses specified url addres (form YT). Depending on url structure it loads playlist or single video.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    loadPlaylistFromUrl : function(url, callback)
    {
        var parser = new urlParser();
        var playlistId = parser.getParameterValue(url, this.params.playlist);
        
        if(playlistId !== URL_PARSE_ERR)
        {
            this._createPlaylist(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, this.params.video);
            if(videoId !== URL_PARSE_ERR)
            {
                this.loadVideo(videoId, callback);
            }
        }
    }
};
