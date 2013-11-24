//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index, config)
{
    this._eventBroker = EventBroker.getInstance();

    this._index = index;
    this._config = config;
    this._item = null;
    this._likeButton = null;
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
            $(that._item).children().find(that._config.AdditionalButtonsContainer).show();
            $(that._item).children().find(that._config.CoverContainer).hide();

        }
    },

    //handles mouse leave event on base item.
    //mainly hides previously shown elements such as additional buttons.
    _onMouseLeave: function(style, that)
    {
        return function()
        {
            $(this).removeClass(style);
            $(that._item).children().find(that._config.AdditionalButtonsContainer).hide();
            $(that._item).children().find(that._config.CoverContainer).show();
        }
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
        this._likeButton = this._item.find(this._config.LikeButtonContainer);
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
        var details = mediaDetails.artist + " - " + mediaDetails.title;
        if(details.length > 35)
        {
            details = details.substring(0, 32)+("...");
        }

        var titleContent = "Debug details:"+
            "\n\nArtist: "+mediaDetails.artist+
            "\nTitle: "+mediaDetails.title+
            "\nDuration: "+mediaDetails.duration.getHumanReadable()+
            "\nUrl: "+mediaDetails.url+
            "\nMediaType: "+mediaDetails.mediaType+
            "\nID: "+mediaDetails.id+
            "\nAlbumCover: "+mediaDetails.albumCover+
            "\nTags: "+mediaDetails.tags+
            "\nLove: "+mediaDetails.loved;
        this._item.attr("title", titleContent);

        this._cover.attr("src", mediaDetails.albumCover);

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
    hookUpToEvents: function(callbackContext, clickHandler, likeHandler, removeHandler)
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

        var onLiked = handleEvent(callbackContext, likeHandler, this._index);
        var onRemoved = handleEvent(callbackContext, removeHandler, this._index);

        this._likeButton.click(onLiked);
        this._removeButton.click(onRemoved);
    },

    //builds fully initialised playlist item.
    build: function()
    {
        return this._item;
    }
};