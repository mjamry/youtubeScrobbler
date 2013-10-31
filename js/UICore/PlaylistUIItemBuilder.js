//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index, config)
{
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
            $(that).children().each(function()
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
            $(that).children().each(function()
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

    //creates icon that will be a part of additional button.
    _createIcon: function(style)
    {
        var icon = document.createElement("i");
        icon.className = style;
        return icon;
    },

    //creates like button which is reponsible for "like" current element.
    _createButton: function(elementType, iconStyle)
    {
        //style will be applied in separated method
        var newButton = document.createElement(elementType);
        $(newButton).hide();

        var innerIcon = this._createIcon(iconStyle);
        newButton.appendChild(innerIcon);

        return newButton;
    },

    //initialises current element
    //creates inner elements.
    initialise: function()
    {
        this._item = document.createElement(this._config.singleElementType);

        this._likeButton = this._createButton(this._config.likeButtonElementType, this._config.likeButtonIconStyle);
        this._removeButton = this._createButton(this._config.removeButtonElementType, this._config.removeButtonIconStyle);

        this._item.appendChild(this._removeButton);
        this._item.appendChild(this._likeButton);
    },

    //add styles to current element and its inner elements.
    setUpStyles: function(style)
    {
        this._item.className += style;
        this._hoverStyle = this._config.hoverElementStyle;

        this._likeButton.className += this._config.likeButtonStyle;
        this._removeButton.className += this._config.removeButtonStyle;
    },

    //fills element body with media details information.
    fillBody: function(mediaDetails)
    {
        this._item.innerHTML += mediaDetails.artist + " - " + mediaDetails.title + " [" + mediaDetails.duration.getHumanReadable() + "]";
    },

    //hooks up to UI events such as clock, mouse enter, mouse leave.
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

    //builds fully initialised playlist item.
    build: function()
    {
        return this._item;
    }
}