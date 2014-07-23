window.Services = window.Services || {};

window.Services.SearchService = function()
{
    this.RESOURCE_TYPE_PLAYLIST = "youtube#playlist";
    this.RESOURCE_TYPE_VIDEO = "youtube#video";
    this.URL_VIDEO = window.Google.GoogleApiConstants.YOUTUBE.URL;
    this.URL_PLAYLIST = window.Google.GoogleApiConstants.YOUTUBE.URL+"0&"+window.Google.GoogleApiConstants.YOUTUBE.LINK_PARAMS.PLAYLIST+"=";

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
        if(details.id.kind == this.RESOURCE_TYPE_PLAYLIST)
        {
            return this.URL_PLAYLIST+details.id.playlistId;
        }
        else if(details.id.kind == this.RESOURCE_TYPE_VIDEO)
        {
            return this.URL_VIDEO+details.id.videoId;
        }
    },

    _getTypeOfResource: function(details)
    {
        if(details.id.kind == this.RESOURCE_TYPE_PLAYLIST)
        {
            return window.Services.SearchResourceType.Playlist;
        }
        else if(details.id.kind == this.RESOURCE_TYPE_VIDEO)
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

window.Services.SearchResultEvents =
{
    SearchFinishedWithError: "SearchFinishedWithError",
    SearchFinishedWithSuccess: "SearchFinishedWithSuccess"
};

window.Services.SearchResourceType =
{
    Playlist: "Playlist",
    Video: "Video"
};