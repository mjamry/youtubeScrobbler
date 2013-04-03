//Class used to create playlist depending upon specified url address.
function videoLoader(){
    this.params = {
        playlist : "list",
        video : "v"
    };
    this.ytApiUrl = "https://gdata.youtube.com/feeds/api/";
    this.apiVersion = 2;
    this.ytFeedParams = "alt=jsonc&v=2";
 }

videoLoader.prototype = 
{
    //gets video data using id. When finished it calls callback function to return data.
    _loadVideo : function(id, callback)
    {
        var url = this.ytApiUrl+"videos/"+id+"?"+this.ytFeedParams;
        $.getJSON(url, function(result)
        {
           var playlist = 
           {
               title: result.data.title,
               videos: [
                   {
                       id: result.data.id, 
                       title: result.data.title
                   }
               ]
           };
           callback(playlist);
           
        });
    },
       
    //gets playlist using playlist id. When finished it calls callback function to return data.
    _loadPlaylist : function(id, callback)
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
               title: result.data.tittle,
               videos: videosList
           };
           
           callback(playlist);
        });
    },
    
    //parses specified url addres (form YT). Depending on url structure it loads playlist or single video.
    //when url is incorrect it returns empty object.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    loadPlaylistFromUrl : function(url, callback)
    {
        var result;
        var parser = new urlParser();
        var playlistId = parser.getParameterValue(url, this.params.playlist);
        
        if(playlistId !== URL_PARSE_ERR)
        {
            result = this._loadPlaylist(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, this.params.video);
            if(videoId !== URL_PARSE_ERR)
            {
                result = this.__loadVideo(videoId, callback);
            }
        }
        
        return result;
    }
};
