window.Services = window.Services || {};

window.Services.WelcomeScreenService = function(config)
{
    this.config = config;
};

window.Services.WelcomeScreenService.prototype =
{
    activateApplication: function()
    {
        //cookie that will expire in one year
        Cookie.getInstance().setCookie(window.Common.CookiesNames.WelcomeCookie, window.Common.CookiesNames.CookieTrueValue, window.Common.CookiesNames.OneYearValid);
    },

    isApplicationAlreadyActivated: function()
    {
        var cookieVal = Cookie.getInstance().getCookie(window.Common.CookiesNames.WelcomeCookie);

        return cookieVal === window.Common.CookiesNames.CookieTrueValue;
    }
};