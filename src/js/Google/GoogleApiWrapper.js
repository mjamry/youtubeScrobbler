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
    _handleServiceError: function()
    {
        UserNotifier.getInstance().error(this.USER_ERROR_MSG);
        Logger.getInstance().warning(this.LOG_ERROR_MSG);
    },

    _initialiseYoutube: function(callback)
    {
        var onServiceInitialised = function()
        {
            Logger.getInstance().info("[Google Api] Youtube service loaded.");
            callback();
        }.bind(this);

        gapi.client.load(window.Google.YoutubeApi.NAME, window.Google.YoutubeApi.VERSION,onServiceInitialised);
    },

    _initialisesAuth: function(callback)
    {
        var onServiceInitialised = function ()
        {
            Logger.getInstance().info("[Google Api] OAuth2 service loaded.");
            callback();
        }.bind(this);

        gapi.client.load(window.Google.AuthApi.NAME, window.Google.AuthApi.VERSION, onServiceInitialised);
    },

    initialise: function()
    {
        gapi.client.setApiKey(window.Google.GoogleApiConstants.API_KEY);

        var serviceInitHandler = function(service)
        {
            return function onServiceInitialised()
            {
                service.isReady = true;
                service.callback();
            };
        };

        for(var service in this._services)
        {
            switch(service)
            {
                case window.Google.ServiceNames.Youtube:
                    this._initialiseYoutube(serviceInitHandler(this._services[service]));
                    break;
                case window.Google.ServiceNames.Auth:
                    this._initialisesAuth(serviceInitHandler(this._services[service]));
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

    _obtainSessionToken: function(requestOptions, callback)
    {
        if(this._services[window.Google.ServiceNames.Auth].isReady)
        {
            var options = $.extend(
                {
                    client_id: window.Google.AuthApi.CLIENT_ID,
                    response_type: "token",
                    scope: [window.Google.AuthApi.SCOPE_PROFILE, window.Google.YoutubeApi.SCOPE]
                },
                requestOptions
            );

            gapi.auth.authorize(options, callback);
        }
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
        if(this._services[window.Google.ServiceNames.Auth].isReady)
        {
            var request = gapi.client.oauth2.userinfo.get();
            request.execute(callback);
        }
    },

    getUserPlaylists: function(callback)
    {
        if(this._services[window.Google.ServiceNames.Youtube].isReady)
        {
            var options =
                {
                    part: 'snippet',
                    fields: 'items,nextPageToken,pageInfo',
                    mine: true,
                    maxResults: window.Google.GoogleApiConstants.MAX_NUMBER_OF_ITEMS_PER_REQUEST
                };

            var request = gapi.client.youtube.playlists.list(options);
            request.execute(callback);
        }
        else
        {
            this._handleServiceError();
        }
    },

    getPlaylistDetails: function(requestOptions, callback)
    {
        if(this._services[window.Google.ServiceNames.Youtube].isReady)
        {
            var options = $.extend(
                {
                    part: 'contentDetails',
                    fields: 'items/contentDetails,nextPageToken,pageInfo',
                    maxResults: window.Google.GoogleApiConstants.MAX_NUMBER_OF_ITEMS_PER_REQUEST
                },
                requestOptions
            );

            var request = gapi.client.youtube.playlistItems.list(options);
            request.execute(callback);
        }
        else
        {
            this._handleServiceError();
        }
    },

    getVideoDetails: function(requestOptions, callback)
    {
        if(this._services[window.Google.ServiceNames.Youtube].isReady)
        {
            var options = $.extend(
                {
                    part: 'contentDetails, snippet',
                    fields: 'items(contentDetails,id,snippet)'
                },
                requestOptions
            );

            var request = gapi.client.youtube.videos.list(options);
            request.execute(callback);
        }
        else
        {
            this._handleServiceError();
        }
    },

    getSearchResults: function(requestOptions, callback)
    {
        if(this._services[window.Google.ServiceNames.Youtube].isReady)
        {
            var options = $.extend(
                {
                    //TODO add country code here
                    part: "snippet",
                    fields: "items(id,snippet),nextPageToken,pageInfo",
                    maxResults: window.Google.GoogleApiConstants.MAX_NUMBER_OF_SEARCH_RESULTS_PER_REQUEST
                },
                requestOptions);
            var request = gapi.client.youtube.search.list(options);
            request.execute(callback);
        }
        else
        {
            this._handleServiceError();
        }
    }
};