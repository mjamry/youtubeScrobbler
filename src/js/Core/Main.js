//using
window.ApplicationCore = window.ApplicationCore || {};
window.UI = window.UI || {};
window.LastFm = window.LastFm || {};

//main
main = function()
{
    var pageLoader = new window.ApplicationCore.PageLoader();

    var coreServicesFactory = new window.ApplicationCore.CoreServicesFactory();
    pageLoader.preInitialise(coreServicesFactory);

    Logger.getInstance().info(window.Common.ApplicationDetails.Name+" version: "+window.Common.ApplicationDetails.Version);
    Logger.getInstance().info("Application initialisation started.");

    var globalErrorHandler = new window.Common.GlobalErrorHandler();
    globalErrorHandler.initialise();

    var uiFactory = new window.UI.UIControllersFactory(window.UI.UIControllersFactoryConfig);
    var playerServicesFactory = new window.Player.PlayerServicesFactory();
    var lastFmServicesFactory = new window.LastFm.LastFmApiFactory();

    pageLoader.initialiseServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);
    pageLoader.initialiseUI(uiFactory, lastFmServicesFactory);

    pageLoader.loadSubpages(uiFactory, window.UI.MenuItemsConfig);

    pageLoader.postInitialise(uiFactory);

    Logger.getInstance().info("Application initialisation ended.");
};

$(window).unload(function()
{
    EventBroker.getInstance().fireEvent(window.Common.ApplicationEvents.ApplicationClosed);
});