window.UI = window.UI || {};

window.UI.PlaylistEditorListItemBuilder = function(index, config)
{
    this._config = config;
    this._item = $("#controls-schemes").find(this._config.EditorListItem).clone();
    this._index = index;

    //to avoid indexes starting on 0
    this._item.find(this._config.ItemIndex).append(index+1);
};

window.UI.PlaylistEditorListItemBuilder.prototype =
{
    setUpArtistAndTrackName: function(artistName, trackName)
    {
        this._item.find(this._config.ArtistAndTrackNameContainer).append(artistName + " - " + trackName);
    },

    setUpAlbumName: function(albumName)
    {
        this._item.find(this._config.AlbumNameContainer).append(albumName);
    },

    setUpMouseClickHandler: function(callbackContext, mouseClickCallback)
    {
        var onMouseClick = function(context, callback, itemIndex)
        {
            return function onMouseClicked(e)
            {
                e.stopPropagation();
                callback.call(context, itemIndex)
            };
        };

        this._item.click(onMouseClick(callbackContext, mouseClickCallback, this._index));
    },

    build: function()
    {
        return this._item;
    }
};