function viewUpdater(){
    
}

viewUpdater.prototype = 
{
    _updatePageTitle: function(value)
    {
        $("title").text(value);
    },
    
    updateVideoTitle: function(video)
    {
        this._updatePageTitle(video);
        $("#player .title").text("Video: "+video.title);
    },
    
    updatePlaylist: function(){

    }
};