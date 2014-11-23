window.Accounts = window.Accounts || {};

window.Accounts.LastFmSessionCoordinator = function(lastFmApi, tokenHandler)
{
    this.lastFmApi = lastFmApi;
    this.tokenHandler = tokenHandler;
};

window.Accounts.LastFmSessionCoordinator.prototype =
{
    _getSessionFromCookies: function()
    {

    },

    _refreshSession: function(token)
    {
        var lastSessionToken = this.tokenHandler.getSessionToken();

        //check if token has been generated, if yes get new session from last.fm using this token
        if(lastSessionToken !== null)
        {
            Logger.getInstance().debug("[LastFm] Refreshing session using token: " + lastSessionToken);
            var that = this;
            return new Promise(function(resolve, reject)
            {
                that.lastFmApi.auth.getSession({token: lastSessionToken}, {success: resolve, error: reject});
            });
        }
        else
        {
            //check if session has been already created, and use it
            var session = Cookie.getInstance().getCookie(window.Common.CookiesNames.sessionCookie);
            if(session !== null)
            {
                return Promise.resolve(
                    {
                        session: session
                    });
            }
        }

        //session cannot be refreshed
        Logger.getInstance().debug("[LastFm] Session does not exists.");
        //pass 9 as a parameter (it means that user has to re authenticate) for more details see window.LastFm.Errors
        return Promise.reject(9);
    },

    _getUserDetails: function(userName)
    {
        var that = this;
        return new Promise(function(resolve, reject)
        {
            that.lastFmApi.user.getInfo({user: userName}, {success: resolve, error: reject});
        });
    },

    _handleSessionEstablished: function(callback, sessionDetails)
    {
        var that = this;
        that._getUserDetails(sessionDetails.name).then(
            function getUserDetailsSuccess(userDetails)
            {
                Logger.getInstance().debug("[LastFm] User details obtained.");
                callback(that._standardiseSessionDetails(userDetails));

                //save session as cookie
                Cookie.getInstance().setCookie(window.Common.CookiesNames.sessionCookie, sessionDetails);
                //inform that last fm session object has been created
                EventBroker.getInstance().fireEventWithData(window.LastFm.Events.SessionObjectCreated, sessionDetails);
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

    initialise: function(callback)
    {
        //there is no need to initialise anything, so just call callback function
        callback();
    },

    establishSession: function()
    {
        this.tokenHandler.generateSessionToken();
    },

    refreshSession: function(callback)
    {
        var that = this;
        this._refreshSession().then(
            function onSessionRefreshSuccess(response)
            {
                Logger.getInstance().debug("[LastFm] Session has been refreshed.");
                that._handleSessionEstablished(callback, response.session);
            },
            function onSessionRefreshError(error)
            {
                Logger.getInstance().debug("[LastFm] Session refreshing error: "+window.LastFm.Errors[error]);
                Cookie.getInstance().removeCookie(window.Common.CookiesNames.sessionCookie);
            }
        );
    }
};