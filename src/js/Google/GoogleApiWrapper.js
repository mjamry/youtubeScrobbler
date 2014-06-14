//namespace
window.Google = window.Google || {};

window.Google.GoogleApiWrapper = function()
{
    this._initialise();
    this.isLoaded = false;
    this.USER_ERROR_MSG = "There is a problem with loading Google services. Please reload page.";
    this.LOG_ERROR_MSG = "[Google API] Youtube service is not loaded yet.";
};

window.Google.GoogleApiWrapper.prototype =
{
    _initialise: function()
    {
        //TODO handle loading errors
        gapi.client.setApiKey(window.Google.GoogleApiConstants.YOUTUBE.API.KEY);
        gapi.client.load(window.Google.GoogleApiConstants.YOUTUBE.API.NAME, window.Google.GoogleApiConstants.YOUTUBE.API.VERSION,
        function()
        {
            //this.isLoaded = true;
            Logger.getInstance().debug("[Google API] Youtube service loaded.");
        }.bind(this));
    },

    getPlaylistDetails: function(requestOptions, callback)
    {
        if(this.isLoaded)
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
            UserNotifier.getInstance().error(this.USER_ERROR_MSG);
            Logger.getInstance().warning(this.LOG_ERROR_MSG);
        }
    },

    getVideoDetails: function(requestOptions, callback)
    {
        if(this.isLoaded)
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
            UserNotifier.getInstance().error(this.USER_ERROR_MSG);
            Logger.getInstance().warning(this.LOG_ERROR_MSG);
        }
    }
};