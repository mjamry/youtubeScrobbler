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
    _handleResult: function(result)
    {
        var output = [];
        result.items.forEach(function(details)
        {

            //TODO: filter titles using naming pattern etc
            output.push(
                {
                    //TODO check if result is a video or playlist and create appropriate url
                    url: window.Google.GoogleApiConstants.YOUTUBE.URL+details.id.videoId,
                    title: details.snippet.title
                }
            );
        });

        EventBroker.getInstance().fireEventWithData(window.Services.SearchResultEvents.SearchFinishedWithSuccess, output);

    },

    search: function(value)
    {
        this.dataProviders.Youtube.getSearchResults({q:value}, this._handleResult);
    }
};

window.Services.SearchResultEvents =
{
    SearchFinishedWithError: "SearchFinishedWithError",
    SearchFinishedWithSuccess: "SearchFinishedWithSuccess"
};