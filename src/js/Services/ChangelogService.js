window.Services = window.Services || {};

window.Services.ChangelogService = function(filePath)
{
    this.changelogeFilePath = filePath;
};

window.Services.ChangelogService.prototype =
{
    _handleChangelogDataRecieved: function(data)
    {
        ModalService.getInstance().show({content: data});
    },

    isNeedToDisplayChangelog: function()
    {
        var appVersionCookieValue = Cookie.getInstance.getCookie(window.Common.CookiesNames.AppVersionCookie);

        if(appVersionCookieValue && appVersionCookieValue == window.Common.ApplicationDetails.Version)
        {
            return false;
        }

        return true;
    },

    getChangelogData: function(callback)
    {
        $.ajax({
            url : this.changelogeFilePath,
            dataType: "text",
            success : callback
        });
    }
};
