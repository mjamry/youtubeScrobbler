//namespace
window.UI = window.UI || {};

window.UI.MediaLoadViewController = function(playlistLoaderService, searchService, searchResultParser, config)
{
    this.playlistLoader = playlistLoaderService;
    this.searchService = searchService;
    this.searchResultParser = searchResultParser;

    this.config = config;

    this.searchControl = $(this.config.SearchResults);
    this.searchResults = $(this.config.SearchResultsContainer);
    this.mediaInput = $(this.config.MediaLocationInput);
};

window.UI.MediaLoadViewController.prototype =
{
    _isUrl: function(value)
    {
        var urlParser = new window.Common.UrlParser();
        return urlParser.isUrl(value);
    },

    _handleSearchItemAdded: function(videoUrl)
    {
        Logger.getInstance().debug("[Search] Video with id "+videoUrl+" has been added.");
        this.playlistLoader.loadPlaylist(videoUrl);
    },

    _handleSearchResult: function(result)
    {
        this.searchResults.empty();
        this.searchControl.show();
        this.searchResults.append(this.searchResultParser.parse(result, this._handleSearchItemAdded, this));
    },

    _handlePlaylistUpdated: function()
    {
        this._clearMediaInput();
    },

    _clearMediaInput: function()
    {
        this.mediaInput.val("");
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
            this._handleInputValue(this.mediaInput.val());
        },
        this));

        $(this.config.SearchResultsControls).find(this.config.SearchResultCloseButton).click($.proxy(function handleCloseSearchResultClicked(e)
        {
            e.preventDefault();
            this.searchControl.hide();
            this._clearMediaInput();
        },
        this));

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, $.proxy(this._handlePlaylistUpdated, this));
        EventBroker.getInstance().addListener(window.Services.SearchResultEvents.SearchFinishedWithSuccess, $.proxy(this._handleSearchResult, this));
    }
};