window.UI = window.UI || {};

window.UI.SearchResultItemBuilder = function(config)
{
    this._videoId = 0;
    this._handler = null;
    this._addButton = null;
    this._item = null;

    this.config = config;
};

window.UI.SearchResultItemBuilder.prototype =
{
    initialise: function()
    {
        this._item = $("#control-schemes .search-result-item").clone();
        this._addButton = this._item.find(this.config.SearchItemAddButton)
    },

    setTitle: function(title)
    {
        this._item.find(this.config.SearchItemTitle).append(title);
    },

    setVideoId: function(videoId)
    {
        this._videoId = videoId;
    },

    setStyle: function(style)
    {
        this._item.addClass(style);
    },

    setAddButtonHandler: function(handler)
    {
        var onAdd = function(handler, videoId)
        {
            return function handleAddButtonClicked()
            {
                handler.call(videoId);
            };
        };

        this._addButton.click(onAdd(handler, this._videoId));
    },

    build: function()
    {
        return this._item;
    }
};