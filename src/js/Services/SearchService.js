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
        Logger.getInstance().debug(JSON.parse(result));
    },

    search: function(value)
    {
        this.dataProviders.search(value, this._handleResult);
    }
};