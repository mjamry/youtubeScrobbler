window.Services = window.Services || {};

window.Services.SearchService = function()
{
    this.dataProviders =
    {
        Youtube: new window.Google.GoogleApiWrapper()
    };
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

    _getTypeOfResource: function(details)
    {
        if(details.id.kind == window.Services.SearchServiceConstants.RESOURCE_TYPE_PLAYLIST)
        {
            return window.Services.SearchResourceType.Playlist;
        }
        else if(details.id.kind == window.Services.SearchServiceConstants.RESOURCE_TYPE_VIDEO)
        {
            return window.Services.SearchResourceType.Video;
        }
    },

    _handleResult: function(result)
    {
        var output = [];
        var that = this;
        result.items.forEach(function(details)
        {

            //TODO: filter titles using naming pattern etc
            output.push(
                {
                    url: that._getUrlForResource(details),
                    title: details.snippet.title,
                    type: that._getTypeOfResource(details),
                    cover: details.snippet.thumbnails.default.url
                }
            );
        });

        EventBroker.getInstance().fireEventWithData(window.Services.SearchResultEvents.SearchFinishedWithSuccess, output);
    },

    search: function(value)
    {
        this.dataProviders.Youtube.getSearchResults({q:value}, this._handleResult.bind(this));
    }
};