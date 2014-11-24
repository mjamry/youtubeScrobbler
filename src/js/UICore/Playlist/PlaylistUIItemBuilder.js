//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index, config)
{
    this._eventBroker = EventBroker.getInstance();

    this._index = index;
    this._config = config;
    this._item = null;
    this._removeButton = null;
    this._hoverStyle = null;
    this._cover = null;
};

window.UI.PlaylistUIItemBuilder.prototype =
{
    //handles mouse over event on base item.
    //mainly shows hidden elements such as additional buttons.
    _onMouseEnter: function(style, that)
    {
        return function()
        {
            $(this).addClass(style);
            $(that._item).children().find(that._config.AdditionalButtonsContainer).slideDown(that._config.AnimationTime);
            $(that._item).children().find(that._config.CoverContainer).slideUp(that._config.AnimationTime);

        };
    },

    //handles mouse leave event on base item.
    //mainly hides previously shown elements such as additional buttons.
    _onMouseLeave: function(style, that)
    {
        return function()
        {
            $(this).removeClass(style);
            $(that._item).children().find(that._config.AdditionalButtonsContainer).slideUp(that._config.AnimationTime);
            $(that._item).children().find(that._config.CoverContainer).slideDown(that._config.AnimationTime);
        };
    },

    _createIcon: function(style)
    {
        var icon = document.createElement("i");
        icon.className += style;

        return icon;
    },

    //initialises current element
    //creates inner elements.
    initialise: function()
    {
        var newItem = $("#controls-schemes .playlist-item");
        this._item = newItem.clone();
        this._item.find(this._config.AdditionalButtonsContainer).hide();

        this._cover = this._item.find(this._config.CoverContainer);
        this._removeButton = this._item.find(this._config.RemoveButtonContainer);
    },

    //add styles to current element and its inner elements.
    setUpStyles: function(style)
    {
        this._item.addClass(style);
    },

    //fills element body with media details information.
    fillBody: function(mediaDetails)
    {
        this._item.find(this._config.TimeContainer).append(mediaDetails.duration.getHumanReadable());
        var details = mediaDetails.artist.name + " - " + mediaDetails.title;

        var titleContent = "Debug details:"+
            "\n\nArtist_name: "+mediaDetails.artist.name+
            "\nArtist_mbid: "+mediaDetails.artist.mbid+
            "\nArtist_url: "+mediaDetails.artist.url+
            "\n\nTitle: "+mediaDetails.title+
            "\nDuration: "+mediaDetails.duration.getHumanReadable()+
            "\nUrl: "+mediaDetails.url+
            "\nMediaType: "+mediaDetails.mediaType+
            "\nID: "+mediaDetails.id+
            "\nmbid: "+mediaDetails.mbid+
            "\n\nAlbum_name: "+mediaDetails.album.name+
            "\nAlbum_mbid: "+mediaDetails.album.mbid+
            "\nAlbum_url: "+mediaDetails.album.url+
            "\nAlbum_cover: "+mediaDetails.album.cover+
            "\n\nTags: "+mediaDetails.tags+
            "\nLove: "+mediaDetails.loved;
        this._item.attr("title", titleContent);

        this._cover.attr("src", mediaDetails.album.cover);

        //show item index (+1 to avoid index=0)
        this._item.find(this._config.IndexStyle).append(this._index+1);

        if(mediaDetails.loved)
        {
            this._item.find(this._config.IconsContainer).append(this._createIcon("fa fa-heart"));
        }

        if(mediaDetails.mediaType == "video/youtube")
        {
            this._item.find(this._config.IconsContainer).append(this._createIcon("fa fa-youtube"));
        }
        this._item.find(this._config.DetailsContainer).append(details);
    },

    //hooks up to UI events such as clock, mouse enter, mouse leave.
    hookUpToEvents: function(callbackContext, clickHandler, removeHandler)
    {
        //event handler
        var handleEvent = function(context, handler, index)
        {
            function handlePlaylistItemEvent(e)
            {
                e.stopPropagation();
                handler.call(context, index);
            }
            return handlePlaylistItemEvent;
        };

        var onClickHandler = handleEvent(callbackContext, clickHandler, this._index);
        var onMouseEnterHandler = this._onMouseEnter(this._hoverStyle, this);
        var onMouseLeaveHandler = this._onMouseLeave(this._hoverStyle, this);
        this._item.click(onClickHandler);
        this._item.mouseenter(onMouseEnterHandler);
        this._item.mouseleave(onMouseLeaveHandler);

        var onRemove = handleEvent(callbackContext, removeHandler, this._index);

        this._removeButton.click(onRemove);
    },

    //builds fully initialised playlist item.
    build: function()
    {
        return this._item;
    }
};