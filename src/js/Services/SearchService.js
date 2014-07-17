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
        result.items.forEach(function(details)
        {
            Logger.getInstance().debug("[Search] title: "+details.snippet.title);
        });

    },

    search: function(value)
    {
        this.dataProviders.Youtube.getSearchResults({q:value}, this._handleResult);
    }
};