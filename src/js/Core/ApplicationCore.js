//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function(){};

window.ApplicationCore.AppCore.prototype =
{
    initialiseGoogleApiServices: function()
    {
        this.googleApiWrapper.initialise();
    },

    createAppServices: function(coreServicesFactory, lastFmServicesFactory, playerServicesFactory)
    {
        var playlistElementDetailsProvider = playerServicesFactory.createPlaylistElementDetailsProvider(lastFmServicesFactory.createTrackInformationProvider());
        this.playlistRepositoryService = coreServicesFactory.createPlaylistRepositoryService();
        this.playlistService = coreServicesFactory.createPlaylistService(this.playlistRepositoryService, playlistElementDetailsProvider);
        this.playlistDetailsProvider = playerServicesFactory.createPlaylistDetailsProvider(this.playlistService);
        this.player = coreServicesFactory.createMediaPlayer(this.playlistDetailsProvider);
        this.onlineScrobbler = coreServicesFactory.createOnlineScrobbler(lastFmServicesFactory.createScrobbler());
        this.googleApiWrapper = coreServicesFactory.createGoogleApiWrapper();
        this.playlistLoaderService = coreServicesFactory.createPlaylistLoaderService(this.playlistService, this.googleApiWrapper);
        this.searchService = coreServicesFactory.createSearchService(this.googleApiWrapper);
        this.playlistFlowController = playerServicesFactory.createPlaylistFlowController(this.playlistService);
        this.playbackDetailsService = coreServicesFactory.createPlaybackDetailsService(this.player);
        this.sessionService = coreServicesFactory.createSessionService(this.googleApiWrapper, lastFmServicesFactory);
        this.sessionService.initialise();
        this.playbackControlService = coreServicesFactory.createPlaybackControlService(this.player, this.playlistFlowController);
        this.playlistElementLoveStateModifier = playerServicesFactory.createPlaylistElementLoveStateModifier(this.playlistDetailsProvider, lastFmServicesFactory.createTrackLoveStateModifier());
        this.welcomeScreenService = coreServicesFactory.createWelcomeService();
        this.playlistManagementService = coreServicesFactory.createPlaylistManagementService(this.playlistRepositoryService, this.playlistService);
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
        this.playbackDetailsViewController = uiFactory.createPlaybackDetailsViewController(this.playbackDetailsService, this.playlistDetailsProvider);
        this.playbackControlViewController = uiFactory.createPlaybackControlViewController(this.player, this.playbackControlService, this.playlistElementLoveStateModifier, this.playlistService);
        this.playlistControlViewController = uiFactory.createPlaylistControlViewController(this.playlistRepositoryService, this.playlistFlowController);
        this.mediaLoadViewController = uiFactory.createMediaLoadViewController(this.playlistLoaderService, this.searchService);
        this.playlistItemEditorViewController = uiFactory.createPlaylistItemEditorViewController(this.playlistService, lastFmServicesFactory.createTrackInformationProvider());
        this.colorSchemeControlViewController = uiFactory.createColorSchemeControlViewController();
        this.userNotificationViewController = uiFactory.createUserNotificationViewController();
        this.progressbarViewController = uiFactory.createProgressbarViewController();
        this.accountDetailsViewController = uiFactory.createAccountsViewController(this.sessionService);
        this.welcomeScreenController = uiFactory.createWelcomeScreenController(this.welcomeScreenService);
        var appDetailsViewController = uiFactory.createAppDetailsViewController();
        appDetailsViewController.setupDetails(window.Common.ApplicationDetails);
        this.menuController = uiFactory.createMenuViewController();
        this.scrobblingControlViewController = uiFactory.createScrobblingControlViewController(this.onlineScrobbler);
        this.playlistSaveViewController = uiFactory.createPlaylistSaveViewController(this.playlistRepositoryService, this.playlistService);
        this.playlistManageViewController = uiFactory.createPlaylistManageViewController(this.playlistManagementService);
    },

    initialiseViewControllers: function(menuConfig)
    {
        this.playlistViewController.initialise();
        this.playbackDetailsViewController.initialise();
        this.playbackControlViewController.initialise();
        this.userNotificationViewController.initialise();
        this.playlistControlViewController.initialise();
        this.mediaLoadViewController.initialise();
        this.playlistItemEditorViewController.initialise();
        this.colorSchemeControlViewController.initialise();
        this.progressbarViewController.initialise();
        this.welcomeScreenController.initialise();
        this.accountDetailsViewController.initialise();
        this.menuController.initialise();
        this.scrobblingControlViewController.initialise();
        this.playlistSaveViewController.initialise();
        this.playlistManageViewController.initialise();

        this._initialiseMenu(menuConfig);

        if(this.welcomeScreenService.isApplicationAlreadyActivated())
        {
            this.welcomeScreenController.showMainScreen();
        }
    },

    _initialiseMenu: function(menuItemsConfiguration)
    {
        for(var item in menuItemsConfiguration)
        {
            this.menuController.add(menuItemsConfiguration[item].Name, menuItemsConfiguration[item].Icon, menuItemsConfiguration[item].Page, menuItemsConfiguration[item].Position);
        }
    }
};
