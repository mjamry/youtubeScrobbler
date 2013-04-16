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
        $("#player .title").text("Video: "+video);
    },
    
    updatePlaylist: function(numberOfItems)
	{
		var playlist = $("#playlist");
		var width = 900;
		var height = $(".ui-state-default").height() * (+numberOfItems);
		var headerHeight = playlist.find(".header").height();
		var size = 
			{
				height: height,
				width: width
			};
			
		playlist.css("height", height + headerHeight);
		playlist.find(" .content").css(size);
		playlist.find(".youtube-player-playlist").css(size);
		
		
    }
};