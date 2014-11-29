window.Accounts = window.Accounts || {};

window.Accounts.LastFmTokenHandler = function(config)
{
    this.config = config;
    this.urlParser = new window.Common.UrlParser();
};

window.Accounts.LastFmTokenHandler.prototype =
{
    _removeTokenFromUrl: function()
    {
        var pageUrl = this.urlParser.getPageUrl(window.location.href);

        window.history.replaceState({}, document.title, pageUrl);
    },

    //try to obtain token from url if it possible, if not search for cookie
    //returns token if successful else null
    getSessionToken: function()
    {
        var token = this.urlParser.getParameterValue(window.location.href, "token");

        if(token !== null)
        {
            this._removeTokenFromUrl();
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