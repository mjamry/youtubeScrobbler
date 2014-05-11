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
        gapi.client.setApiKey(window.Google.GoogleApiConstants.API_KEY);
        gapi.client.load("youtube", "v3",
        function()
        {
            Logger.getInstance().debug("[Google API] youtube service loaded.");
        });
    },

    obtainPlaylistDetails: function(requestOptions, callback)
    {
        var options = $.extend(
            {
                part: 'snippet',
                fields: 'items/snippet,nextPageToken,pageInfo',
                maxResults:window.Google.GoogleApiConstants.MAX_NUMBER_OF_ITEMS_PER_REQUEST
            },
            requestOptions);

        var request = gapi.client.youtube.playlistItems.list(options);
        request.execute(callback);
    },

    obtainVideoDetails: function(requestOptions, callback)
    {
        var options = $.extend(
            {
                part: 'snippet',
                fields: 'items/snippet'
            },
            requestOptions);

        var request = gapi.client.youtube.videos.list(options);
        request.execute(callback);
    }
};