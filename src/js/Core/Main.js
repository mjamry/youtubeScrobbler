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

    var globalErrorHandler = new window.Common.GlobalErrorHandler();
    globalErrorHandler.initialise();

    var uiFactory = new window.UI.UIControllersFactory(window.UI.UIControllersFactoryConfig);
    var playerServicesFactory = new window.Player.PlayerServicesFactory();
    var lastFmServicesFactory = new window.LastFm.LastFmApiFactory();

    pageLoader.loadSubpages(uiFactory, window.UI.MenuItemsConfig);
    pageLoader.initialiseServices(coreServicesFactory, lastFmServicesFactory, playerServicesFactory);
    pageLoader.initialiseUI(uiFactory, lastFmServicesFactory);
    pageLoader.postInitialise(uiFactory);
};

$(window).unload(function()
{
    EventBroker.getInstance().fireEvent(window.Common.ApplicationEvents.ApplicationClosed);
});