//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index)
{
    this._index = index;
    this._item = null;
    this._likeButton = null;
    this._hoverStyle = null;
};

window.UI.PlaylistUIItemBuilder.prototype =
{
    _onMouseEnter: function(style, that)
    {
        return function()
        {
            $(this).addClass(style);
            $(that).children().each(function()
            {
                $(this).show();
            })
        }
    },

    _onMouseLeave: function(style, that)
    {
        return function()
        {
            $(this).removeClass(style);
            $(that).children().each(function()
            {
                $(this).hide();
            })
        }
    },

    _onClick: function(eventBroker, index)
    {
        return function()
        {
            //TODO add new style and remove from previous element.
            eventBroker.fireEventWithData(window.UI.Events.PlaySpecificRequested, index);
        }
    },

    _createLikeButton: function(elementType)
    {
        var likeBtn = document.createElement(elementType);

        //TODO add specific style instead of below...
        likeBtn.width = 20;
        likeBtn.height = 20;
        likeBtn.innerHTML = "likeMe";
        $(likeBtn).hide();

        return likeBtn;
    },

    initialise: function(elementType)
    {
        this._item = document.createElement(elementType);

        //TODO add separate element type to config
        this._likeButton = this._createLikeButton(elementType);
        this._item.appendChild(this._likeButton);

    },

    setUpStyles: function(style, hoverStyle)
    {
        this._item.className += style;
        this._hoverStyle = hoverStyle;
    },

    fillBody: function(mediaDetails)
    {
        this._item.innerHTML += mediaDetails.artist + " - " + mediaDetails.title + " [" + mediaDetails.duration.getHumanReadable() + "]";
    },

    hookUpToEvents: function()
    {
        //hook up on to events
        var onClickHandler = this._onClick(this._eventBroker = window.Common.EventBrokerSingleton.instance(), this._index);
        var onMouseEnterHandler = this._onMouseEnter(this._hoverStyle, this._item);
        var onMouseLeaveHandler = this._onMouseLeave(this._hoverStyle, this._item);
        this._item.onclick = onClickHandler;
        this._item.onmouseenter = onMouseEnterHandler;
        this._item.onmouseleave = onMouseLeaveHandler;
    },

    build: function()
    {
        return this._item;
    }
}