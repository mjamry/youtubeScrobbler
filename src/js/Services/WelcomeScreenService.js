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
        Cookie.getInstance().setCookie(this.config.WelcomeCookieName, this.config.WelcomeCookieTrueValue, 356);
    },

    isApplicationAlreadyActivated: function()
    {
        var cookieVal = Cookie.getInstance().getCookie(this.config.WelcomeCookieName);

        return cookieVal === this.config.WelcomeCookieTrueValue;
    }
};