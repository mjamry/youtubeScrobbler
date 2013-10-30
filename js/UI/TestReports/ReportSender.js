//using
window.UI = window.UI || {};

window.UI.ReportSender = function(){};

window.UI.ReportSender.prototype =
{
    _getBrowser: function()
    {
        return navigator.appCodeName +" "+navigator.appVersion;
    },

    _getOperatingSystem: function()
    {
        return navigator.platform;
    },

    _getUserAgent: function()
    {
        return navigator.userAgent;
    },

    send: function(sender, title, description)
    {
        var b = this._getBrowser();
        var os = this._getOperatingSystem();
        var c = this._getUserAgent();
    }
}