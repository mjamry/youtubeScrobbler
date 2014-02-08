//namespace
window.UI = window.UI || {};

window.UI.SessionViewController = function(model, config)
{
    this.model = model;
    this.config = config;
    this.view = $(config.SessionDetailsButton);
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

            that.view.unbind("click");
            that.view.click(function()
            {
                window.open(that.config.LinkToPortal+userDetails, "_blank");
            });

            that.view.html('<div class="authentication-button">Hello! '+userDetails+'</div>');
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

    initialise: function()
    {
        this.view.click($.proxy(function()
        {
            window.location = this.config.PortalAuthLink + window.LastFm.LastFmConstants.API_KEY + "&" + this.config.PortalUrlCallbackParam + document.URL;
        }, this));

        var token = this._getToken();

        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablished, this._handleNewSession(this, token));
        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablishmentFailed, this._handleSessionError(this, token));

        this._createSession(token);
    }
};