function viewUpdater(){
    
}

viewUpdater.prototype = 
{
    _updatePageTitle: function(value)
    {
        $("title").text(value);
    },
    
    updateVideoTitle: function(value)
    {
        this._updatePageTitle(value);
        $("#player .title").text("Video: "+video.title);
    }
};