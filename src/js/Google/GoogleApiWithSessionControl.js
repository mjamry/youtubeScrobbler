window.Google = window.Google || {};

//Mainly has the same methods as default google api wrapper but it checks responses for error 401 (unauthorized) and try to refresh token if possible
window.Google.GoogleApiWithSessionControl = function(defaultGoogleApiWrapper)
{
    this._innerApiWrapper = defaultGoogleApiWrapper;
};

window.Google.GoogleApiWithSessionControl.prototype =
{
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
        }
    },

    _refreshToken: function ()
    {
        var that = this;
        return new Promise(function (resolve, reject)
        {
            that._innerApiWrapper.refreshSessionToken(that._handleGoogleResponse(resolve, reject));
        });
    },

    _authorizeUser: function ()
    {
        var that = this;
        return new Promise(function (resolve, reject)
        {
            that._innerApiWrapper.authorize(that._handleGoogleResponse(resolve, reject));
        });
    },

    _establishSession: function ()
    {
        var that = this;
        return that._refreshToken().
            then(function ()
                {
                    Logger.getInstance().debug("[Google] Token has been refreshed.");
                    return Promise.resolve();
                }
            ).catch(function ()
                {
                    return that._authorizeUser().
                        then(function ()
                            {
                                Logger.getInstance().debug("[Google] New Token has been obtained.");
                            }
                        ).catch(function ()
                            {
                                Logger.getInstance().debug("[Google] Session obtaining error.");
                            }
                        );
                }
            );
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

    _apiCallWithSessionControl: function(apiMethod, callback)
    {
        var that = this;
        var apiCallPromise = function ()
        {
            return new Promise(function (resolve, reject)
            {
                that._innerApiWrapper[apiMethod](that._handleGoogleResponse(resolve, reject));
            });
        };

        apiCallPromise().
            then(function (response)
            {
                Logger.getInstance().debug("[Google] 2_2");
                callback(response);
            }
            ).catch(function ()
                {
                    Logger.getInstance().debug("[Google] 2_3");
                    that._establishSession().
                        then(function ()
                        {
                            Logger.getInstance().debug("[Google] 2_4");
                            return apiCallPromise();
                        }
                    ).then(function (response)
                        {
                            Logger.getInstance().debug("[Google] 2_5");
                            callback(response);
                        }
                    );
                }
            );
    },

    getUserInfo: function (callback)
    {
        this._apiCallWithSessionControl("getUserInfo", callback);
    },

    getUserPlaylists: function(callback)
    {
        this._apiCallWithSessionControl("getUserPlaylists", callback);
    }
};