//namespace
window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.CoreServicesFactory = function(){}

window.ApplicationCore.CoreServicesFactory.prototype =
{
    createBrokerHandler: function()
    {
        return new window.Common.EventBroker(window.Player.Events);
    },

    createLoggerService: function()
    {
        return new Logger();
    },

    createOnlineScrobbler: function()
    {
        return new window.ApplicationCore.OnlineScrobbler();
    }
}

