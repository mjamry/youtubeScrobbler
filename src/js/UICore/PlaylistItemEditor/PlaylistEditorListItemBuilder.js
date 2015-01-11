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
    //handles mouse over event on base item.
    //mainly shows hidden elements such as additional buttons.
    _onMouseEnter: function()
    {
        this._item.children().find(this._config.RemoveButtonContainer).show(this._config.AnimationTime);
    },

    //handles mouse leave event on base item.
    //mainly hides previously shown elements such as additional buttons.
    _onMouseLeave: function()
    {
        this._item.children().find(this._config.RemoveButtonContainer).hide(this._config.AnimationTime);
    },

    _addIconIfPossible: function(item, iconStyle)
    {
        if(iconStyle)
        {
            var icon = document.createElement("i");
            icon.className = iconStyle;
            this._item.find(item).append(icon);
        }
    },

    _setUpMouseClickAction: function(element, context, callback)
    {
        var onMouseClick = function(ctx, clb, itemIndex)
        {
            return function onMouseClicked(e)
            {
                e.stopPropagation();
                clb.call(ctx, itemIndex);
            };
        };

        element.click(onMouseClick(context, callback, this._index));
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

    setUpMouseClickHandler: function(context, callback)
    {
        this._setUpMouseClickAction(this._item, context, callback);
    },

    setUpRemoveAction: function(context, callback)
    {
        this._setUpMouseClickAction(this._item.find(this._config.RemoveButtonContainer), context, callback);
    },

    build: function()
    {
        //hook up to mouse actions
        this._item.mouseenter($.proxy(this._onMouseEnter, this));
        this._item.mouseleave($.proxy(this._onMouseLeave, this));
        //hide remove button
        this._item.children().find(this._config.RemoveButtonContainer).hide();

        return this._item;
    }
};