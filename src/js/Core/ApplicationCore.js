//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function(coreServicesFactory, uiFactory, playerServicesFactory)
{
    this.uiCore = uiFactory.createUICore();

    this.sessionHandler = coreServicesFactory.createSessionHandler();
    this.onlineScrobbler = coreServicesFactory.createOnlineScrobbler(this.sessionHandler);

    this.playlistService = coreServicesFactory.createPlaylistService();
    this.playlistLoaderService = coreServicesFactory.createPlaylistLoaderService(this.playlistService);

    this.player = coreServicesFactory.createMediaPlayer(this.uiCore.getPlayerContainer(), this.playlistService);
    this.playbackDetailsService = coreServicesFactory.createPlaybackDetailsService(this.player);

    this.playlistFlowController = playerServicesFactory.createPlaylistFlowController(this.playlistService);

    this.playbackControlService = coreServicesFactory.createPlaybackControlService(this.player, this.playlistFlowController);

    this.playlistElementDetailsProvider = playerServicesFactory.createPlaylistElementDetailsProvider(this.playlistService, this.sessionHandler);

    var playlistElementLoveStateModifier = playerServicesFactory.createPlaylistElementLoveStateModifier(this.sessionHandler, this.playlistService);

    this.playlistViewController = uiFactory.createPlaylistViewController(this.playlistService, this.playbackControlService, this.playlistFlowController);

    this.playbackDetailsViewController = uiFactory.createPlaybackDetailsViewController(this.playbackDetailsService);

    this.playbackControlViewController = uiFactory.createPlaybackControlViewController(this.player, this.playbackControlService);

    this.playlistControlViewController = uiFactory.createPlaylistControlViewController(this.playlistService, this.playlistFlowController, playlistElementLoveStateModifier);

    this.sessionViewController = uiFactory.createSessionViewController(this.sessionHandler);

    this.mediaLoadViewController = uiFactory.createMediaLoadViewController(this.playlistLoaderService);

    this.playlistItemEditorViewController = uiFactory.createPlaylistItemEditorViewController(this.playlistService);

    this.colorSchemeControlViewController = uiFactory.createColorSchemeControlViewController();

    this.userNotificationViewController = uiFactory.createUserNotificationViewController();

    this.progressbarViewController = uiFactory.createProgressbarViewController();
};

window.ApplicationCore.AppCore.prototype =
{
    initialise: function()
    {
        this.playbackDetailsService.initialise();
        this.playbackControlService.initialise();
        this.playlistViewController.initialise();
        this.playbackDetailsViewController.initialise();
        this.playbackControlViewController.initialise();
        this.userNotificationViewController.initialise();
        this.playlistControlViewController.initialise();
        this.playlistElementDetailsProvider.initialise();
        this.mediaLoadViewController.initialise();
        this.sessionViewController.initialise();
        this.playlistItemEditorViewController.initialise();
        this.onlineScrobbler.initialise();
        this.colorSchemeControlViewController.initialise();
        this.playlistService.initialise();
        this.progressbarViewController.initialise();
    }
};
