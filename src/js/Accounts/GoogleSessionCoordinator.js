window.Accounts = window.Accounts || {};

window.Accounts.GoogleSessionCoordinator = function(googleApiWrapper)
{
    this._innerApiWrapper = googleApiWrapper;
};

window.Accounts.GoogleSessionCoordinator.prototype =
{
    //TODO: these two methods, are copied from google api wrapper, and should be rather shared
    _handleGoogleResponse: function (resolve, reject)
    {
        var that = this;
        return function onGoogleResponded(response)
        {
            if (that._checkForErrors(response))
            {
                resolve(response);
            }
            else
            {
                reject();
            }
        };
    },

    _checkForErrors: function (response)
    {
        if ("error" in response)
        {
            //check for unauthorized (401) error
            Logger.getInstance().warning("[Google] Communication error: " + response.error.message + " (" + response.error.code + ")");
            return false;
        }

        return true;
    },

    _handleSessionEstablished: function(callback)
    {
        var that = this;
        that._getUserDetails().then(
            function getUserDetailsSuccess(userDetails)
            {
                Logger.getInstance().debug("[Google] User details obtained.");
                callback(that._standardiseSessionDetails(userDetails));
            },
            function getUserDetailsError()
            {
                Logger.getInstance().debug("[Google] Error while obtaining user details.");
            })
    },

    //response : {
    //"id": "117575643415949930977",
    //"name": "scrobbline a",
    //"given_name": "scrobbline",
    //"family_name": "a",
    //"link": "https://plus.google.com/117575643415949930977",
    //"picture": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
    //"locale": "en"
    //}
    //use window.Accounts.SessionDetails to pass it further
    _standardiseSessionDetails: function(details)
    {
        var sessionDetails = new window.Accounts.SessionDetails();
        sessionDetails.AccountName = window.Accounts.AccountsNames.Google;
        sessionDetails.UserName = details.given_name;
        sessionDetails.PictureUrl = details.picture;

        return sessionDetails;
    },

    _refreshToken: function ()
    {
        var that = this;
        return new Promise(function (resolve, reject)
            {
                that._innerApiWrapper.refreshSessionToken(that._handleGoogleResponse(resolve, reject));
            }
        );
    },

    _authorizeUser: function ()
    {
        var that = this;
        return new Promise(function (resolve, reject)
            {
                that._innerApiWrapper.authorize(that._handleGoogleResponse(resolve, reject));
            }
        );
    },

    _refreshSession: function(errorHandler, callback)
    {
        var that = this;
        return that._refreshToken().
            then(
            function refreshTokenSuccess()
            {
                Logger.getInstance().debug("[Google] Session has been refreshed.");
                that._handleSessionEstablished(callback);
            },
            function refreshTokenError()
            {
                errorHandler();
            }
        );
    },

    _getUserDetails: function()
    {
        var that = this;
        return new Promise(function(resolve, reject)
        {
            that._innerApiWrapper.getUserInfo(that._handleGoogleResponse(resolve, reject));
        });
    },

    establishSession: function (callback)
    {
        var that = this;
        //try to authenticate when refreshing session was not successful
        var refreshSessionError = function onSessionRefreshError()
        {
            that._authorizeUser().
                then(function authorizeUserSuccess()
                {
                    Logger.getInstance().debug("[Google] New session has been established.");
                    that._handleSessionEstablished(callback);
                },
                function authorizeUserError()
                {
                    Logger.getInstance().debug("[Google] Session obtaining error.");
                }
            );
        };

        this._refreshSession(refreshSessionError, callback);
    },

    refreshSession: function(callback)
    {
        var errorHandler = function onSessionRefreshError()
        {
            Logger.getInstance().debug("[Google] Cannot refresh session.");
        };

        this._refreshSession(errorHandler, callback);
    }
};
