//namespace
window.Google = window.Google || {};

window.Google.GoogleApiWrapper = function(){};

window.Google.GoogleApiWrapper.prototype =
{
    obtainPlaylistDetails: function(requestOptions, callback)
    {
        gapi.client.setApiKey(window.Google.GoogleApiConstants.API_KEY);

        var options = $.extend(
            {
                part: 'snippet',
                maxResults:window.Google.GoogleApiConstants.MAX_NUMBER_OF_ITEMS_PER_REQUEST
            },
            requestOptions);

        var request = gapi.client.youtube.playlistItems.list(options);
        request.execute(callback);
    }
};