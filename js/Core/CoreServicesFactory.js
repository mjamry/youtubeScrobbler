//namespace
window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.CoreServicesFactory = function(){}

window.ApplicationCore.CoreServicesFactory.prototype =
{
    createBrokerHandler: function()
    {
        return new window.Common.EventBroker();
    },

    createLoggerService: function()
    {
        return new Logger();
    },

    createOnlineScrobbler: function()
    {
        return new window.ApplicationCore.OnlineScrobbler();
    },

    createCookieHandler: function()
    {
        return new window.Common.CookieHandler();
    }
}

