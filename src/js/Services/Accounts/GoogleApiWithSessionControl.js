window.Google = window.Google || {};

//Mainly has the same methods as default google api wrapper but it checks responses for error 401 (unauthorized) and try to refresh token if possible
window.Google.GoogleApiWithSessionControl = function(googleApiWrapper, googleSessionManager)
{
    this._innerApiWrapper = googleApiWrapper;
    this._sessionManager = googleSessionManager;
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
                    that._sessionManager.establishSession().
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