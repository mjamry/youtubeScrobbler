//using
window.ApplicationCore = window.ApplicationCore || {};
window.UI = window.UI || {};
window.LastFm = window.LastFm || {};

var pageLoader;
var coreServicesFactory;
var uiFactory;
var playerServicesFactory;
var lastFmServicesFactory;

//main
$(function()
{
    pageLoader = new window.ApplicationCore.PageLoader();

    //create factories
    coreServicesFactory = new window.ApplicationCore.CoreServicesFactory();
    uiFactory = new window.UI.UIControllersFactory(window.UI.UIControllersFactoryConfig);
    playerServicesFactory = new window.Player.PlayerServicesFactory();
    lastFmServicesFactory = new window.LastFm.LastFmApiFactory();

    pageLoader.load(coreServicesFactory, lastFmServicesFactory, playerServicesFactory, uiFactory, window.Common.PagesConfiguration, window.UI.MenuItemsConfig);
});

$(window).on("beforeunload", function()
{
    EventBroker.getInstance().fireEvent(window.Common.ApplicationEvents.ApplicationClosed);
});

main = function()
{
    pageLoader.initialiseGoogleServices();
};