//namespace
window.ApplicationCore = window.ApplicationCore || {};

window.ApplicationCore.CoreServicesFactory = function(){}

window.ApplicationCore.CoreServicesFactory.prototype =
{
    createLoggerService: function()
    {
        return new Logger();
    },

    createOnlineScrobbler: function()
    {
        return new window.ApplicationCore.OnlineScrobbler();
    }
}

