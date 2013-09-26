//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};

//It is a facade for jquery-youtube-player library.
//Provides possibility to attach to player events.
window.Player.YouTubePlayer = function(configuration, playerContainer)
{
    this.eventBroker = window.Common.EventBrokerSingleton.instance();
    //stored video details
    this.playlistLength = 0;
    this.currentVideoDetails = null;

    //TODO it should be changed, i have to think about that...
	//updates currentVideoDetails and fires videoLoaded event
	var onVideoLoaded = function(video)
	{
		var loader = new window.Player.YouTubePlaylistLoader();
		loader.loadVideo(video.id, $.proxy(
				function(videoDetails)
				{
                    //TODO improve equals validation
                    if(!this.currentVideoDetails || this.currentVideoDetails.id !== videoDetails.videos[0].id)
                    {
                        if(this.currentVideoDetails != null)
                        {
                            this.eventBroker.fireEventWithData(window.Player.Events.videoStoped, this.currentVideoDetails);
                        }
                        this.currentVideoDetails = videoDetails.videos[0];
                        window.Common.Log.Instance().Debug("Video: \""+this.currentVideoDetails.name+"\" has been loaded.");
                        this.eventBroker.fireEventWithData(window.Player.Events.videoPlay, this.currentVideoDetails);
                    }
				}
				, this));
	};

    //extends jquery-youtube-player configuration by event handlers.
    this.config = $.extend(
        {
            //extends options by event handlers
            onReady:$.proxy(function(){this.eventBroker.fireEvent(window.Player.Events.playerReady);}, this),
            onError: $.proxy(function(msg){this.eventBroker.fireEventWithData(window.Player.Events.error, msg);}, this),
            
            onVideoLoaded: $.proxy(function(video){this.eventBroker.fireEventWithData(window.Player.Events.videoLoaded, video);}, this),
            onVideoPaused: $.proxy(function(){this.eventBroker.fireEvent(window.Player.Events.videoPaused);}, this),
            onVideoPlay: $.proxy(onVideoLoaded, this),
            onVideoCue: $.proxy(function(video){this.eventBroker.fireEventWithData(window.Player.Events.videoCue, video);}, this),
            onBuffer: $.proxy(function(){this.eventBroker.fireEvent(window.Player.Events.videoBuffering);}, this),

            onAfterPlaylistLoaded: $.proxy(function(){this.eventBroker.fireEvent(window.Player.Events.playlistReady);}, this),
            onBeforePlaylistLoaded: $.proxy(function(){this.eventBroker.fireEvent(window.Player.Events.beforePlaylistReady);}, this)
        }
        ,configuration
    );
        
    this.instance = playerContainer.player(this.config);
    window.Common.Log.Instance().Info("YouTube player has been configured and initialised.");
};

window.Player.YouTubePlayer.prototype =
{
    _executeAction: function(action)
    {
        this.instance.player(action);
        return false;
    },
    
    _onPlaylistReady:function(playlist)
    {

        this.instance.player("loadPlaylist", playlist);
		this.playlistLength = playlist.videos.length;

        window.Common.Log.Instance().Info("Playlist has been loaded, contains "+this.playlistLength+" video(s).");
        this.eventBroker.fireEvent(window.Player.Events.playlistReady);
    },
            
    hookUpButtonAction: function(button, action)
    {
        $("#"+button).find("a").click(
            $.proxy(this._executeAction, this, action)
        );
    },

    loadPlaylistFromUrl: function(url)
    {
        window.Common.Log.Instance().Debug("Try loading playlist using URL: "+url);
        var loader = new window.Player.YouTubePlaylistLoader();
        loader.loadPlaylistFromUrl(
                url, 
                $.proxy(this._onPlaylistReady, this)
        );
    },
	    
    getCurrentVideo:function()
    {
		return this.currentVideoDetails;
    },
			
	getPlaylistLength:function()
	{
		return this.playlistLength;
	}
};