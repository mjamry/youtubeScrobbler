//namespace
window.UI = window.UI || {};

window.UI.MediaLoadViewController = function(model, config)
{
    this.model = model;
    this.config = config;
};

window.UI.MediaLoadViewController.prototype =
{
    _handlePlaylistUpdated: function()
    {
        $(this.config.MediaLocationInput).val("");
    },

    _addNewMedia: function addNewMedia(location)
    {
        //TODO - check location type and get correct playlist provider from factory
        var plLoader = new window.Player.YouTubePlaylistLoader();
        plLoader.loadPlaylistFromUrl(
            location,
            $.proxy(function(playlist)
            {
                this.model.addToPlaylist(playlist);
            }, this)
        );
    },

    initialise: function initialise()
    {
        $(this.config.AddNewMediaButton).click($.proxy(function handleAddMediaClicked(e)
        {
            e.preventDefault();
            this._addNewMedia($(this.config.MediaLocationInput).val());
        },
        this));

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, $.proxy(this._handlePlaylistUpdated, this));
    }
};