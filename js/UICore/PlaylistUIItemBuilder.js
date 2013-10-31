//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index, config)
{
    this._index = index;
    this._config = config;
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

    _createIcon: function(style)
    {
        var icon = document.createElement("i");
        icon.className = style;
        return icon;
    },

    _createLikeButton: function(elementType, style, iconStyle)
    {
        var likeBtn = document.createElement(elementType);
        likeBtn.className += style;
        $(likeBtn).hide();

        var innerIcon = this._createIcon(iconStyle);
        likeBtn.appendChild(innerIcon);

        return likeBtn;
    },

    initialise: function()
    {
        this._item = document.createElement(this._config.singleElementType);

        this._likeButton = this._createLikeButton(this._config.likeButtonElementType, this._config.likeButtonStyle, this._config.likeButtonIconStyle);
        this._item.appendChild(this._likeButton);
    },

    setUpStyles: function(style)
    {
        this._item.className += style;
        this._hoverStyle = this._config.hoverElementStyle;
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