//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function()
{
};

window.ApplicationCore.AppCore.prototype =
{
    initialiseGoogleApiServices: function()
    {
        this.googleApiWrapper.initialise();
    },

    createAppServices: function(coreServicesFactory, lastFmServicesFactory, playerServicesFactory)
    {
        this.onlineScrobbler = coreServicesFactory.createOnlineScrobbler(lastFmServicesFactory.createScrobbler());

        var playlistElementDetailsProvider = playerServicesFactory.createPlaylistElementDetailsProvider(lastFmServicesFactory.createTrackInformationProvider());
        this.googleApiWrapper = coreServicesFactory.createGoogleApiWrapper();
        this.playlistService = coreServicesFactory.createPlaylistService(playlistElementDetailsProvider);
        this.playlistLoaderService = coreServicesFactory.createPlaylistLoaderService(this.playlistService, this.googleApiWrapper);
        this.searchService = coreServicesFactory.createSearchService(this.googleApiWrapper);

        this.player = coreServicesFactory.createMediaPlayer(this.playlistService);
        this.playbackDetailsService = coreServicesFactory.createPlaybackDetailsService(this.player);

        this.sessionService = coreServicesFactory.createSessionService(this.googleApiWrapper);
        this.sessionService.initialise();

        this.playlistFlowController = playerServicesFactory.createPlaylistFlowController(this.playlistService);

        this.playbackControlService = coreServicesFactory.createPlaybackControlService(this.player, this.playlistFlowController);

        this.playlistElementLoveStateModifier = playerServicesFactory.createPlaylistElementLoveStateModifier(this.playlistService, lastFmServicesFactory.createTrackLoveStateModifier());

        this.welcomeScreenService = coreServicesFactory.createWelcomeService();
    },

    initialiseAppServices: function()
    {
        this.playbackDetailsService.initialise();
        this.playbackControlService.initialise();
        this.onlineScrobbler.initialise();
        this.playlistService.initialise();
    },

    createViewControllers: function(uiFactory, lastFmServicesFactory)
    {
        this.playlistViewController = uiFactory.createPlaylistViewController(this.playlistService, this.playbackControlService, this.playlistFlowController);
        this.playbackDetailsViewController = uiFactory.createPlaybackDetailsViewController(this.playbackDetailsService);
        this.playbackControlViewController = uiFactory.createPlaybackControlViewController(this.player, this.playbackControlService, this.playlistElementLoveStateModifier, this.playlistService);
        this.playlistControlViewController = uiFactory.createPlaylistControlViewController(this.playlistService, this.playlistFlowController);
        this.mediaLoadViewController = uiFactory.createMediaLoadViewController(this.playlistLoaderService, this.searchService);
        this.playlistItemEditorViewController = uiFactory.createPlaylistItemEditorViewController(this.playlistService, lastFmServicesFactory.createTrackInformationProvider());
        this.playlistItemEditorListViewController = uiFactory.createPlaylistEditorListViewController(this.playlistService);
        this.colorSchemeControlViewController = uiFactory.createColorSchemeControlViewController();
        this.userNotificationViewController = uiFactory.createUserNotificationViewController();
        this.progressbarViewController = uiFactory.createProgressbarViewController();
        this.accountDetailsViewController = uiFactory.createAccountsViewController(this.sessionService);
        this.welcomeScreenController = uiFactory.createWelcomeScreenController(this.welcomeScreenService);
        var appDetailsViewController = uiFactory.createAppDetailsViewController();
        appDetailsViewController.setupDetails(window.Common.ApplicationDetails);
        this.menuController = uiFactory.createMenuViewController();
        this.scrobblingControlViewController = uiFactory.createScrobblingControlViewController(this.onlineScrobbler);
    },

    initialiseViewControllers: function(menuItemsConfiguration)
    {
        this.playlistViewController.initialise();
        this.playbackDetailsViewController.initialise();
        this.playbackControlViewController.initialise();
        this.userNotificationViewController.initialise();
        this.playlistControlViewController.initialise();
        this.mediaLoadViewController.initialise();
        this.playlistItemEditorViewController.initialise();
        this.playlistItemEditorListViewController.initialise();
        this.colorSchemeControlViewController.initialise();
        this.progressbarViewController.initialise();
        this.welcomeScreenController.initialise();
        this.accountDetailsViewController.initialise();
        this.menuController.initialise();
        this.scrobblingControlViewController.initialise();

        for(var item in menuItemsConfiguration)
        {
            this.menuController.add(menuItemsConfiguration[item].Name, menuItemsConfiguration[item].Icon, menuItemsConfiguration[item].Page);
        }

        if(this.welcomeScreenService.isApplicationAlreadyActivated())
        {
            this.welcomeScreenController.showMainScreen();
        }
    }
};
