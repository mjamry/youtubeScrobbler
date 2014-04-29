//namespace
window.Google = window.Google || {};

window.Google.GoogleApiWrapper = function(){};

window.Google.GoogleApiWrapper.prototype =
{
    obtainPlaylistDetails: function(requestOptions, callback)
    {
        gapi.client.setApiKey(window.Google.GoogleApiConstants.API_KEY);

        var request = gapi.client.youtube.playlistItems.list(requestOptions);
        request.execute(callback);
    }
};