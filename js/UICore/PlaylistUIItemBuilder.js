//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index, config)
{
    this._eventBroker = window.Common.EventBrokerSingleton.instance();

    this._index = index;
    this._config = config;
    this._item = null;
    this._likeButton = null;
    this._removeButton = null;
    this._hoverStyle = null;
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
            $(that).children().find(".playlist-item-buttons").each(function()
            {
                $(this).show();
            })
        }
    },

    //handles mouse leave event on base item.
    //mainly hides previously shown elements such as additional buttons.
    _onMouseLeave: function(style, that)
    {
        return function()
        {
            $(this).removeClass(style);
            $(that).children().find(".playlist-item-buttons").each(function()
            {
                $(this).hide();
            })
        }
    },

    //handles click event.
    _onClick: function(eventBroker, index)
    {
        return function()
        {
            //TODO add new style and remove from previous element.
            eventBroker.fireEventWithData(window.UI.Events.PlaySpecificRequested, index);
        }
    },

    //handles "like" for current media element event.
    _like: function(index)
    {
        return function(e)
        {
            e.stopPropagation();
            //TODO do some more appropriate actions
            alert("liked! "+index);
        }
    },

    //handler "remove" from playlist event.
    _remove: function(eventBroker, index)
    {
        return function(e)
        {
            e.stopPropagation();
            eventBroker.fireEventWithData(window.Player.PlaylistEvents.PlaylistRemoveItemRequested, index);
        }
    },

    //initialises current element
    //creates inner elements.
    initialise: function()
    {
        var newItem = $("#controls-schemes .playlist-item");
        this._item = newItem.clone();
        this._item.find(".playlist-item-buttons").hide();


        this._likeButton = this._item.find(".playlist-item-like");
        this._removeButton = this._item.find(".playlist-item-remove");
//        this._item = document.createElement(this._config.singleElementType);
//
//        this._likeButton = this._createButton(this._config.innerButtonElementType, this._config.likeButtonIconStyle);
//        this._removeButton = this._createButton(this._config.innerButtonElementType, this._config.removeButtonIconStyle);
//
//        this._item.appendChild(this._removeButton);
//        this._item.appendChild(this._likeButton);
    },

    //add styles to current element and its inner elements.
    setUpStyles: function(style)
    {
        this._item.addClass(style);
        this._hoverStyle = this._config.hoverElementStyle;
    },

    //fills element body with media details information.
    fillBody: function(mediaDetails)
    {
        this._item.find(".playlist-item-time").append(mediaDetails.duration.getHumanReadable());
        var details = mediaDetails.artist + " - " + mediaDetails.title;
        if(details.length > 35)
        {
            details = details.substring(0, 33)+("...");
        }
        this._item.find(".playlist-item-details").append(details);
    },

    //hooks up to UI events such as clock, mouse enter, mouse leave.
    hookUpToEvents: function()
    {
        //hook up on to events
        var onClickHandler = this._onClick(this._eventBroker, this._index);
        var onMouseEnterHandler = this._onMouseEnter(this._hoverStyle, this._item);
        var onMouseLeaveHandler = this._onMouseLeave(this._hoverStyle, this._item);
        this._item.click(onClickHandler);
        this._item.mouseenter(onMouseEnterHandler);
        this._item.mouseleave(onMouseLeaveHandler);

        var onLiked = this._like(this._index);
        var onRemoved = this._remove(this._eventBroker, this._index);

        this._likeButton.click(onLiked);
        this._removeButton.click(onRemoved);
    },

    //builds fully initialised playlist item.
    build: function()
    {
        return this._item;
    }
};