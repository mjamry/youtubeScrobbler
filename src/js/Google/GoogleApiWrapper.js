//namespace
window.Google = window.Google || {};

window.Google.GoogleApiWrapper = function()
{
    this.USER_ERROR_MSG = "There is a problem with loading Google services. Please reload page.";
    this.LOG_ERROR_MSG = "[Google API] Youtube service is not loaded yet.";

    //{name, callback, ready}
    this._services = [];
};

window.Google.GoogleApiWrapper.prototype =
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
                reject(response);
            }
        };
    },

    _checkForErrors: function (response)
    {
        if ("error" in response)
        {
            Logger.getInstance().warning("[Google] Error: " + response.error.message + " (" + response.error.code + ")");
            return false;
        }

        return true;
    },

    _handleServiceError: function()
    {

    },

    _handleResponseError: function(error)
    {
        UserNotifier.getInstance().error(this.USER_ERROR_MSG);
        Logger.getInstance().warning(error.message);
    },

    _initialiseYoutube: function(callback)
    {
        if(!this._services[window.Google.ServiceNames.Youtube].isReady)
        {
            var onServiceInitialised = function ()
            {
                Logger.getInstance().info("[Google Api] Youtube service loaded.");
                this._services[window.Google.ServiceNames.Youtube].isReady = true;
                callback();
            }.bind(this);

            gapi.client.load(window.Google.YoutubeApi.NAME, window.Google.YoutubeApi.VERSION, onServiceInitialised);
        }
    },

    _initialisesAuth: function(callback)
    {
        if(!this._services[window.Google.ServiceNames.Auth].isReady)
        {
            var onServiceInitialised = function ()
            {
                Logger.getInstance().info("[Google Api] OAuth2 service loaded.");
                this._services[window.Google.ServiceNames.Auth].isReady = true;
                callback();
            }.bind(this);

            gapi.client.load(window.Google.AuthApi.NAME, window.Google.AuthApi.VERSION, onServiceInitialised);
        }
    },

    _obtainSessionToken: function(requestOptions, callback)
    {
        if(this._services[window.Google.ServiceNames.Auth].isReady)
        {
            var options = $.extend(
                {
                    client_id: window.Google.ApiKeys.CLIENT_ID,
                    response_type: "token",
                    scope: [window.Google.AuthApi.SCOPE_PROFILE, window.Google.YoutubeApi.SCOPE]
                },
                requestOptions
            );

            gapi.auth.authorize(options, callback);
        }
    },

    initialise: function()
    {
        gapi.client.setApiKey(window.Google.ApiKeys.API_KEY);

        for(var service in this._services)
        {
            switch(service)
            {
                case window.Google.ServiceNames.Youtube:
                    this._initialiseYoutube(this._services[service].callback);
                    break;
                case window.Google.ServiceNames.Auth:
                    this._initialisesAuth(this._services[service].callback);
                    break;
            }
        }
    },

    initialiseService: function(serviceName, callback)
    {
        this._services[serviceName] =
            {
                callback: callback,
                isReady: false
            };
    },

    authorize: function(callback)
    {
        //show sign on dialog
        this._obtainSessionToken({immediate:false}, callback);
    },

    refreshSessionToken: function(callback)
    {
        //without sign on dialog
        this._obtainSessionToken({immediate:true}, callback);
    },

    getUserInfo: function(callback)
    {
        //this._requestData(gapi.client.oauth2.userinfo.get, null, callback);
        if(this._services[window.Google.ServiceNames.Auth].isReady)
        {
            var request = gapi.client.oauth2.userinfo.get();
            request.execute(callback);
        }
    },

    getUserPlaylists: function(callback)
    {
        var options =
            {
                part: 'snippet',
                fields: 'items,nextPageToken,pageInfo',
                mine: true,
                maxResults: window.Google.GoogleApiConstants.MAX_NUMBER_OF_ITEMS_PER_REQUEST
            };

        this._requestData(gapi.client.youtube.playlists.list, options, callback);
    },

    getPlaylistDetails: function(requestOptions, callback)
    {
        var options = $.extend(
            {
                part: 'contentDetails',
                fields: 'items/contentDetails,nextPageToken,pageInfo',
                maxResults: window.Google.GoogleApiConstants.MAX_NUMBER_OF_ITEMS_PER_REQUEST
            },
            requestOptions
        );

        this._requestData(gapi.client.youtube.playlistItems.list, options, callback);
    },

    getVideoDetails: function(requestOptions, callback)
    {
        var options = $.extend(
            {
                part: 'contentDetails, snippet',
                fields: 'items(contentDetails,id,snippet)'
            },
            requestOptions
        );

        this._requestData(gapi.client.youtube.videos.list, options, callback);
    },

    getSearchResults: function(requestOptions, callback)
    {
        var options = $.extend(
            {
                part: "snippet",
                fields: "items(id,snippet),nextPageToken,pageInfo",
                maxResults: window.Google.GoogleApiConstants.MAX_NUMBER_OF_SEARCH_RESULTS_PER_REQUEST
            },
            requestOptions);

        return this._requestData(gapi.client.youtube.search.list, options, callback);
    },

    _requestData: function(dataSource, options, callback)
    {
        var that = this;
        return new Promise(function(resolve, reject)
            {
                try
                {
                    var request = dataSource(options);
                    request.execute(that._handleGoogleResponse(resolve, reject));
                }
                catch(e)
                {
                    reject({message: that.LOG_ERROR_MSG});
                }
            }
        )
        .then(callback)
        .catch(function(error)
        {
            that._handleResponseError(error)
        });
    }
};