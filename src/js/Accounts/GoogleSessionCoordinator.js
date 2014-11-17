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

    _refreshSession: function(errorHandler, successHandler)
    {
        var that = this;
        return that._refreshToken().
            then(
            function()
            {
                Logger.getInstance().debug("[Google] Token has been refreshed.");
                successHandler(window.Accounts.AccountsNames.Google);
            },
            function()
            {
                errorHandler();
            }
        );
    },

    establishSession: function (callback)
    {
        var that = this;
        //try to authenticate when refreshing session was not successful
        var refreshSessionError = function onSessionRefreshError()
        {
            that._authorizeUser().
                then(function()
                {
                    Logger.getInstance().debug("[Google] New Token has been obtained.");
                    callback(window.Accounts.AccountsNames.Google);
                },
                function()
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
