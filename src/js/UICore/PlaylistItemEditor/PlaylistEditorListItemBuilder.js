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
    _addIconIfPossible: function(item, iconStyle)
    {
        if(iconStyle)
        {
            var icon = document.createElement("i");
            icon.className = iconStyle;
            this._item.find(item).append(icon);
        }
    },

    setUpArtistAndTrackName: function(artistName, trackName)
    {
        var field = this._item.find(this._config.ArtistAndTrackNameContainer);

        this._addIconIfPossible(this._config.ArtistIconContainer, this._config.ArtistIcon);
        field.append(artistName + " - " + trackName);
    },

    setUpAlbumName: function(albumName)
    {
        var field = this._item.find(this._config.AlbumNameContainer);
        if(albumName)
        {
            this._addIconIfPossible(this._config.AlbumIconContainer, this._config.AlbumIcon);
            field.append(albumName);
        }
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