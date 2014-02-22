//namespace
window.UI = window.UI || {};

window.UI.SessionViewController = function(model, config)
{
    this.model = model;
    this.config = config;
};

window.UI.SessionViewController.prototype =
{
    _clearToken: function(token)
    {
        if(token != window.Common.UrlParserConstants.URL_PARSE_ERR)
        {
            //reload page removing parameters
            window.location = window.location.pathname;
        }
    },

    //handles session establishing error
    _handleSessionError: function(that, token)
    {
        return function()
        {
            that._clearToken(token);
        };
    },

    //handles successfully established session
    _handleNewSession: function(that, token)
    {
        return function(userDetails)
        {
            that._clearToken(token);

            $(that.config.SessionDetailsButton).html('<div class="authentication-button">Hello! '+userDetails+'</div>');

            $(that.config.SessionEstablishedContainer).show();
            $(that.config.NoSessionContainer).hide();
        };
    },

    //obtains token from current url address
    _getToken: function()
    {
        var urlPars = new window.Common.UrlParser();
        var token = urlPars.getParameterValue(window.location.href, "token");

        Logger.getInstance().Debug("Token: "+token+" has been obtained.");

        return token;
    },

    //creates new session using passed token
    _createSession: function(token)
    {
        this.model.createNewSession(token);
    },

    //clears current session
    _clearCurrentSession: function()
    {

    },

    initialise: function()
    {
        $(this.config.SignInButton).click($.proxy(function()
        {
            window.location = this.config.PortalAuthLink + window.LastFm.LastFmConstants.API_KEY + "&" + this.config.PortalUrlCallbackParam + document.URL;
        },
        this));

        $(this.config.SignOutButton).click($.proxy(function()
        {
            this._clearCurrentSession();
        },
        this));

        var token = this._getToken();

        $(this.config.SessionEstablishedContainer).hide();

        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablished, this._handleNewSession(this, token));
        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablishmentFailed, this._handleSessionError(this, token));

        this._createSession(token);
    }
};