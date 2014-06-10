//namespace
window.Google = window.Google || {};

window.Google.GoogleApiWrapper = function()
{
    this._initialise();
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
            Logger.getInstance().debug("[Google API] youtube service loaded.");
        });
    },

    getPlaylistDetails: function(requestOptions, callback)
    {
        var options = $.extend(
            {
                part: 'contentDetails',
                fields: 'items/contentDetails,nextPageToken,pageInfo',
                maxResults: window.Google.GoogleApiConstants.MAX_NUMBER_OF_ITEMS_PER_REQUEST
            },
            requestOptions);

        var request = gapi.client.youtube.playlistItems.list(options);
        request.execute(callback);
    },

    getVideoDetails: function(requestOptions, callback)
    {
        var options = $.extend(
            {
                part: 'contentDetails, snippet',
                fields: 'items(contentDetails,id,snippet)',
            },
            requestOptions);

        var request = gapi.client.youtube.videos.list(options);
        request.execute(callback);
    }
};