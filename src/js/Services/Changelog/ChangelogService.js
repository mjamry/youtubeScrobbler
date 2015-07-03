window.Services = window.Services || {};

window.Services.ChangelogService = function(filePath)
{
    this.changelogeFilePath = filePath;
};

window.Services.ChangelogService.prototype =
{
    _handleChangelogDataRecieved: function(data)
    {
        EventBroker.getInstance().fireEventWithData(window.Services.ChangelogEvents.ChangelogDataReceived, data);
    },

    isNeedToDisplayChangelog: function()
    {
        var appVersionCookieValue = Cookie.getInstance().getCookie(window.Common.CookiesNames.AppVersionCookie);

        if(appVersionCookieValue && appVersionCookieValue == window.Common.ApplicationDetails.Version)
        {
            return false;
        }

        return true;
    },

    setVersionCookie: function()
    {
        Cookie.getInstance().setCookie(window.Common.CookiesNames.AppVersionCookie, window.Common.ApplicationDetails.Version);
    },

    getChangelogData: function()
    {
        $.ajax({
            url : this.changelogeFilePath,
            dataType: "text",
            success : this._handleChangelogDataRecieved
        });
    }
};
