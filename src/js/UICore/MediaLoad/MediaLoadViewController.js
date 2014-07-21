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

    _handleSearchItemAdded: function(videoUrl)
    {
        Logger.getInstance().debug("[Search] Video with id "+videoUrl+" has been added.");
        //TODO only temporarly - add close button/icon instead
        $(this.config.SearchResultsContainer).hide();
        this.playlistLoader.loadPlaylist(videoUrl);
    },

    _handleSearchResult: function(result)
    {
        var searchResultContainer = $(this.config.SearchResultsContainer);
        searchResultContainer.empty();
        searchResultContainer.show();
        var that = this;
        result.forEach(function(item)
        {
            Logger.getInstance().debug("[Search] title: "+item.title+" id: "+item.url);
            var builder = new window.UI.SearchResultItemBuilder(window.UI.MediaLoadConfig);
            builder.initialise();
            builder.setTitle(item.title);
            builder.setVideoUrl(item.url);
            builder.setAddButtonHandler(that._handleSearchItemAdded, that);

            var searchItem = builder.build();
            searchResultContainer.append(searchItem);

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