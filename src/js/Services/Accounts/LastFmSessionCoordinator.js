window.Accounts = window.Accounts || {};

window.Accounts.LastFmSessionCoordinator = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
};

window.Accounts.LastFmSessionCoordinator.prototype =
{
    _refreshSession: function(token)
    {
        Logger.getInstance().debug("[LastFm] Refreshing session using token: " + token);
        var that = this;
        return new Promise(function(resolve, reject)
        {
            that.lastFmApi.auth.getSession({token:token}, {success: resolve, error: reject});
        });
    },

    _getUserDetails: function(userName)
    {
        var that = this;
        return new Promise(function(resolve, reject)
        {
            that.lastFmApi.user.getInfo({user: userName}, {success: resolve, error: reject});
        });
    },

    _handleSessionEstablished: function(callback, userName)
    {
        var that = this;
        that._getUserDetails(userName).then(
            function getUserDetailsSuccess(userDetails)
            {
                Logger.getInstance().debug("[LastFm] User details obtained.");
                callback(that._standardiseSessionDetails(userDetails));
            },
            function getUserDetailsError()
            {
                Logger.getInstance().debug("[LastFm] Error while obtaining user details.");
            });
    },

    //Details structure:
    //<user>
    //    <id>1000002</id>
    //    <name>RJ</name>
    //    <realname>Richard Jones </realname>
    //    <url>http://www.last.fm/user/RJ</url>
    //    <image>http://userserve-ak.last.fm/serve/126/8270359.jpg</image>
    //    <country>UK</country>
    //    <age>27</age>
    //    <gender>m</gender>
    //    <subscriber>1</subscriber>
    //    <playcount>54189</playcount>
    //    <playlists>4</playlists>
    //    <bootstrap>0</bootstrap>
    //    <registered unixtime="1037793040">2002-11-20 11:50</registered>
    //</user>
    _standardiseSessionDetails: function(details)
    {
        var sessionDetails = new window.Accounts.SessionDetails();
        sessionDetails.AccountName = window.Accounts.AccountsNames.LastFM;
        sessionDetails.UserName = details.user.name;
        sessionDetails.PictureUrl = details.user.image[1]["#text"];
        sessionDetails.Details =
        {
            age: details.user.age,
            gender: details.user.gender,
            playcount: details.user.playcount
        };

        return sessionDetails;
    },

    establishSession: function(callback)
    {
        //just move to another page where
        window.location = this.config.PortalAuthLink + window.LastFm.LastFmConstants.API_KEY + "&" + this.config.PortalUrlCallbackParam + document.URL;
    },

    refreshSession: function(callback)
    {
        var lastSessionToken = Cookie.getInstance().getCookie(window.Common.CookiesNames.sessionCookie);
        if(lastSessionToken == null)
        {
            Logger.getInstance().debug("[LastFm] Cannot refresh session token does not exist.");
            return Promise.reject();
        }

        var that = this;
        this._refreshSession(lastSessionToken).then(
            function onSessionRefreshSuccess(response)
            {
                Logger.getInstance().debug("[LastFm] Session has been refreshed.");
                that._handleSessionEstablished(callback, response.session.name);
            },
            function onSessionRefreshError(error)
            {
                Logger.getInstance().debug("[LastFm] Session refreshing error: "+window.LastFm.Errors[error]);
                Cookie.getInstance().removeCookie(window.Common.CookiesNames.sessionCookie);
            }
        );
    }
};