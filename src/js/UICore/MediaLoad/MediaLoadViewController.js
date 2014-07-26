//namespace
window.UI = window.UI || {};

window.UI.MediaLoadViewController = function(playlistLoaderService, searchService, config)
{
    this.playlistLoader = playlistLoaderService;
    this.searchService = searchService;
    this.config = config;
    this.REGEX_URL_PATTERN = "(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})\\.*";

    this.searchControl = $(this.config.SearchResults);
    this.searchResults = $(this.config.SearchResultsContainer);
    this.mediaInput = $(this.config.MediaLocationInput);
};

window.UI.MediaLoadViewController.prototype =
{
    _isUrl: function(value)
    {
        var regex = new RegExp(this.REGEX_URL_PATTERN);
        return regex.test(value);
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
        var that = this;
        result.forEach(function(item)
        {
            Logger.getInstance().debug("[Search] title: "+item.title+" id: "+item.url);
            var builder = new window.UI.SearchResultItemBuilder(window.UI.MediaLoadConfig);
            builder.initialise();
            builder.setTitle(item.title);
            builder.setVideoUrl(item.url);
            builder.setAddButtonHandler(that._handleSearchItemAdded, that);

            var icons = [that.config.YoutubeIcon];
            if(item.type == window.Services.SearchResourceType.Playlist)
            {
                icons.push(that.config.PlaylistIcon);
            }
            builder.setIcons(icons);
            builder.setCover(item.cover);

            var searchItem = builder.build();
            that.searchResults.append(searchItem);
        });
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