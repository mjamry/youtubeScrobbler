//namespace
window.UI = window.UI || {};

window.UI.MediaLoadViewController = function(playlistLoaderService, searchService, config)
{
    this.playlistLoader = playlistLoaderService;
    this.searchService = searchService;
    this.config = config;
};

window.UI.MediaLoadViewController.prototype =
{
    _isUrl: function()
    {
        //todo add some logic checking if passed string value is an url - regex
        return false;
    },

    _handleSearchResult: function(result)
    {
        result.forEach(function(item)
        {
            Logger.getInstance().debug("[Search] title: "+item.title+" id: "+item.id);
        });
    },

    _handlePlaylistUpdated: function()
    {
        $(this.config.MediaLocationInput).val("");
    },

    _handleInputValue: function(value)
    {
        if(this._isUrl(value))
        {
            this.playlistLoader.loadPlaylist(value);
        }
        else
        {
            this.searchService.search(value);
        }
    },

    initialise: function initialise()
    {
        $(this.config.AddNewMediaButton).click($.proxy(function handleAddMediaClicked(e)
        {
            e.preventDefault();
            this._handleInputValue($(this.config.MediaLocationInput).val());
        },
        this));

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, $.proxy(this._handlePlaylistUpdated, this));
        EventBroker.getInstance().addListener(window.Services.SearchResultEvents.SearchFinishedWithSuccess, $.proxy(this._handleSearchResult, this));
    }
};