//namespace
window.UI = window.UI || {};

//using
window.Player = window.Player || {};


window.UI.PlaylistViewController = function(playlistContainer, config)
{
    this._container = $("#"+playlistContainer);
    this._config = config;
    this._eventBroker = window.Common.EventBrokerSingleton.instance();
};

window.UI.PlaylistViewController.prototype =
{
    _onMouseEnter: function(config)
    {
        return function()
        {
            $(this).addClass(config.hoverElementStyle);
        }
    },

    _onMouseLeave: function(config)
    {
        return function()
        {
            $(this).removeClass(config.hoverElementStyle);
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

    _createNewElement: function(item, index)
    {
        var newElement = document.createElement(this._config.singleElementType);
        var isIndexEven = index%2 == 0;

        //add style
        if(isIndexEven)
        {
            newElement.className += this._config.evenElementStyle;
        }
        else
        {
            newElement.className += this._config.oddElementStyle;
        }

        //fill body
        newElement.innerHTML = item.artist + " - " + item.title + " [" + item.duration.getHumanReadable() + "]";

        //hook up on to events
        var onClickHandler = this._onClick(this._eventBroker, index);
        var onMouseEnterHandler = this._onMouseEnter(this._config);
        var onMouseLeaveHandler = this._onMouseLeave(this._config);
        newElement.onclick = onClickHandler;
        newElement.onmouseenter = onMouseEnterHandler;
        newElement.onmouseleave = onMouseLeaveHandler;

        return newElement;
    },

    _handlePlaylistUpdated: function(playlist)
    {
        this._container.empty();
        for(var i=0; i < playlist.length(); i++)
        {
            var item = playlist.getItem(i);
            if(item)
            {
                var newElement = this._createNewElement(item, i);
                this._container.append(newElement);
            }
        }
    },

    _handleMediaChanged: function(mediaDetails)
    {

    },

    initialise: function()
    {
        this._eventBroker.addListener(window.Player.Events.PlaylistUpdated, this._handlePlaylistUpdated, null, this);
        this._eventBroker.addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);
    }
}