window.Services = window.Services || {};

window.Services.SearchService = function(dataProviders)
{
    this.dataProviders = dataProviders;
    this.dataProviders[window.Google.ServiceNames.Youtube].initialiseService(window.Google.ServiceNames.Youtube, function(){});
};

window.Services.SearchService.prototype =
{
    //gets url depending on resource type
    _getUrlForResource: function(details)
    {
        if(details.id.kind == window.Services.SearchServiceConstants.RESOURCE_TYPE_PLAYLIST)
        {
            return window.Services.SearchServiceConstants.URL_PLAYLIST+details.id.playlistId;
        }
        else if(details.id.kind == window.Services.SearchServiceConstants.RESOURCE_TYPE_VIDEO)
        {
            return window.Services.SearchServiceConstants.URL_VIDEO+details.id.videoId;
        }
    },

    _isPlaylist: function(details)
    {
        if(details.id.kind == window.Services.SearchServiceConstants.RESOURCE_TYPE_PLAYLIST)
        {
            return true;
        }

        return false;
    },

    _handleResult: function(result)
    {
        var output = [];
        var that = this;
        result.items.forEach(function(details)
        {
            output.push(
                {
                    url: that._getUrlForResource(details),
                    name: details.snippet.title,
                    cover: details.snippet.thumbnails.default.url,
                    isPlaylist: that._isPlaylist(details)
                }
            );
        });

        EventBroker.getInstance().fireEventWithData(window.Services.SearchResultEvents.SearchFinishedWithSuccess, output);
    },

    search: function(value)
    {
        this.dataProviders[window.Google.ServiceNames.Youtube].getSearchResults({q:value}, this._handleResult.bind(this));
    }
};