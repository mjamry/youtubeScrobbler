//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function(coreServicesFactory, uiFactory, playerServicesFactory)
{
    this.uiCore = uiFactory.createUICore();

    this.sessionHandler = coreServicesFactory.createSessionHandler();
    window.Common.Cookie.setInstance(coreServicesFactory.createCookieHandler());
    this.onlineScrobbler = coreServicesFactory.createOnlineScrobbler(this.sessionHandler);
    this.player = coreServicesFactory.createMediaPlayer(this.uiCore.getPlayerContainer());
    this.playlistService = coreServicesFactory.createPlaylistService(this.player);
    this.playbackDetailsService = coreServicesFactory.createPlaybackDetailsService();
    this.playbackDetailsService.initialise();

    var playlistFlowController = playerServicesFactory.createPlaylistFlowController(this.playlistService);

    this.playbackControlService = coreServicesFactory.createPlaybackControlService(this.player, playlistFlowController);
    this.playbackControlService.initialise();

    var playlistElementDetailsProvider = playerServicesFactory.createPlaylistElementDetailsProvider(this.playlistService, this.sessionHandler);
    playlistElementDetailsProvider.initialise();

    var playlistElementLoveStateModifier = playerServicesFactory.createPlaylistElementLoveStateModifier(this.sessionHandler);

    var playlist = uiFactory.createPlaylistViewController(this.playlistService, this.playbackControlService, playlistElementLoveStateModifier);
    playlist.initialise();

    var playbackDetails = uiFactory.createPlaybackDetailsViewController(this.playbackDetailsService);
    playbackDetails.initialise();

    var playbackControl = uiFactory.createPlaybackControlViewController(this.player, this.playbackControlService);
    playbackControl.initialise();

    var playlistControl = uiFactory.createPlaylistControlViewController(this.playlistService, playlistFlowController);
    playlistControl.initialise();
};

window.ApplicationCore.AppCore.prototype =
{
    _handlePlaySpecificRequest: function(index)
    {
        this.playlistService.playSpecific(index);
    },

    initialise: function()
    {
        this.onlineScrobbler.initialise();
        //hook up to UI events - mainly to control player/playlist
        var eventBroker = EventBroker.getInstance();
        eventBroker.addListener(window.UI.Events.PlayNextRequested, this.playlistService.playNext, null, this);
        eventBroker.addListener(window.UI.Events.PlayPreviousRequested, this.playlistService.playPrevious, null, this);
        eventBroker.addListener(window.UI.Events.PlaySpecificRequested, this._handlePlaySpecificRequest, null, this);
    },

    createNewSession: function(token)
    {
        this.sessionHandler.createNewSession(token);
    },

    //TODO move to ViewController
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

    //TODO move to ViewController
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
