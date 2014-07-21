window.UI = window.UI || {};

window.UI.SearchResultItemBuilder = function(config)
{
    this._videoUrl = 0;
    this._handler = null;
    this._addButton = null;
    this._item = null;

    this.config = config;
};

window.UI.SearchResultItemBuilder.prototype =
{
    initialise: function()
    {
        this._item = $("#controls-schemes .search-result-item").clone();
        this._addButton = this._item.find(this.config.SearchItemAddButton)
    },

    setTitle: function(title)
    {
        this._item.find(this.config.SearchItemTitle).append(title);
    },

    setVideoUrl: function(videoUrl)
    {
        this._videoUrl = videoUrl;
    },

    setStyle: function(style)
    {
        this._item.addClass(style);
    },

    setAddButtonHandler: function(handler, context)
    {
        var onAddButtonClicked = function(handlerContext, handler, videoId)
        {
            return function handleAddButtonClicked()
            {
                handler.call(handlerContext, videoId);
            };
        };

        this._addButton.click(onAddButtonClicked(context, handler, this._videoUrl));
    },

    build: function()
    {
        return this._item;
    }
};