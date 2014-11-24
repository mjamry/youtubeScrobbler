window.Accounts = window.Accounts || {};

window.Accounts.LastFmTokenHandler = function(config)
{
    this.config = config;
};

window.Accounts.LastFmTokenHandler.prototype =
{
    //try to obtain token from url if it possible, if not search for cookie
    //returns token if successful else null
    getSessionToken: function()
    {
        var urlPars = new window.Common.UrlParser();
        var token = urlPars.getParameterValue(window.location.href, "token");

        if(token !== null)
        {
            return token;
        }

        return null;
    },

    //redirect to the login page
    //TODO try to do it as a pop up window
    generateSessionToken: function()
    {
        window.location = this.config.PortalAuthLink + window.LastFm.LastFmConstants.API_KEY + "&" + this.config.PortalUrlCallbackParam + document.URL;
    }
};