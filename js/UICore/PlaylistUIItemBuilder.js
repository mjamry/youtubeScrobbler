//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index)
{
    this._index = index;
    this._item = null;
    this._hoverStyle = null;
};

window.UI.PlaylistUIItemBuilder.prototype =
{
    _onMouseEnter: function(style)
    {
        return function()
        {
            $(this).addClass(style);
        }
    },

    _onMouseLeave: function(style)
    {
        return function()
        {
            $(this).removeClass(style);
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

    initialise: function(elementType)
    {
        this._item = document.createElement(elementType);
    },

    setUpStyles: function(style, hoverStyle)
    {
        this._item.className += style;
        this._hoverStyle = hoverStyle;
    },

    fillBody: function(mediaDetails)
    {
        this._item.innerHTML = mediaDetails.artist + " - " + mediaDetails.title + " [" + mediaDetails.duration.getHumanReadable() + "]";
    },

    hookUpToEvents: function()
    {
        //hook up on to events
        var onClickHandler = this._onClick(this._eventBroker = window.Common.EventBrokerSingleton.instance(), this._index);
        var onMouseEnterHandler = this._onMouseEnter(this._hoverStyle);
        var onMouseLeaveHandler = this._onMouseLeave(this._hoverStyle);
        this._item.onclick = onClickHandler;
        this._item.onmouseenter = onMouseEnterHandler;
        this._item.onmouseleave = onMouseLeaveHandler;
    },

    build: function()
    {
        return this._item;
    }
}