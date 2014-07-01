//namespace
window.UI = window.UI || {};

window.UI.SessionViewController = function(model, config)
{
    this.model = model;
    this.config = config;
};

window.UI.SessionViewController.prototype =
{
    //handles session establishing error
    _handleSessionError: function(model, token)
    {
        return function()
        {
            model.clearToken(token);
        };
    },

    //handles successfully established session
    _handleNewSession: function(that, token)
    {
        return function onSessionEstablished(userDetails)
        {
            that.model.clearToken(token);

            $(that.config.SessionDetailsButton).html('<a href="'+that.config.LinkToPortal+userDetails+'" target="_blank"><div class="authentication-button">Hello! '+userDetails+'</div></a>');

            $(that.config.SessionEstablishedContainer).show();
            $(that.config.NoSessionContainer).hide();
        };
    },

    _handleSessionClosed: function(that)
    {
        return function onSessionClosed()
        {
            $(that.config.SessionEstablishedContainer).hide();
            $(that.config.NoSessionContainer).show();
        };
    },

    //creates new session using passed token
    _createSession: function(token)
    {
        this.model.createNewSession(token);
    },

    //clears current session
    _clearCurrentSession: function()
    {
        this.model.closeSession();
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

        var token = this.model.getToken();

        $(this.config.SessionEstablishedContainer).hide();

        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablished, this._handleNewSession(this, token));
        EventBroker.getInstance().addListener(window.LastFm.Events.SessionClosed, this._handleSessionClosed(this));
        EventBroker.getInstance().addListener(window.LastFm.Events.SessionEstablishmentFailed, this._handleSessionError(this.model, token));

        this._createSession(token);
    }
};