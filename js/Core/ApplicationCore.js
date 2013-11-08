//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function(coreServicesFactory, uiFactory)
{
    this.uiCore = uiFactory.createUICore();

    this.sessionHandler = coreServicesFactory.createSessionHandler();
    window.Common.Cookie.setInstance(coreServicesFactory.createCookieHandler());
    this.onlineScrobbler = coreServicesFactory.createOnlineScrobbler(this.sessionHandler);
    this.player = coreServicesFactory.createMediaPlayer(this.uiCore.getPlayerContainer());
    this.playlistService = coreServicesFactory.createPlaylistService(this.player);


    var playlist = uiFactory.createPlaylistViewController(this.playlistService);
    playlist.initialise();
};

window.ApplicationCore.AppCore.prototype =
{
    //TODO move it to more appropriate service/class
    _changeTrackLoveState: function(index)
    {
        var mediaDetails = this.playlistService.getTrackDetails(index);
        window.Common.EventBrokerSingleton.instance().fireEventWithData(window.LastFm.Events.TrackLoveStateChanged, mediaDetails);
    },

    _handlePlaySpecificRequest: function(index)
    {
        this.playlistService.playSpecific(index);
    },

    initialise: function()
    {
        this.onlineScrobbler.initialise();
        //hook up to UI events - mainly to control player/playlist
        var eventBroker = window.Common.EventBrokerSingleton.instance();
        eventBroker.addListener(window.UI.Events.PlayNextRequested, this.playlistService.playNext, null, this);
        eventBroker.addListener(window.UI.Events.PlayPreviousRequested, this.playlistService.playPrevious, null, this);
        eventBroker.addListener(window.UI.Events.PlaySpecificRequested, this._handlePlaySpecificRequest, null, this);
        eventBroker.addListener(window.UI.Events.TrackLikeStateChangeRequested, this._changeTrackLoveState, null, this);
    },

    createNewSession: function(token)
    {
        this.sessionHandler.createNewSession(token);
    },

    createNewPlaylist: function(url)
    {
        var plLoader = new window.Player.YouTubePlaylistLoader();
        plLoader.loadPlaylistFromUrl(
            url,
            $.proxy(function(playlist)
            {
                this.playlistService.createPlaylist(playlist);
            }, this)
        );
    },

    addToPlaylist: function(url)
    {
        var plLoader = new window.Player.YouTubePlaylistLoader();
        plLoader.loadPlaylistFromUrl(
            url,
            $.proxy(function(playlist)
            {
                this.playlistService.addToPlaylist(playlist)
            }, this)
        );
    }
};
