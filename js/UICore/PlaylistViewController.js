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
    _createNewElement: function(mediaDetails, index)
    {
        var builder = new window.UI.PlaylistUIItemBuilder(index);
        builder.initialise(this._config.singleElementType);

        var isIndexEven = index%2 == 0;

        //add style
        if(isIndexEven)
        {
            builder.setUpStyles(this._config.evenElementStyle, this._config.hoverElementStyle);
        }
        else
        {
            builder.setUpStyles(this._config.oddElementStyle, this._config.hoverElementStyle);
        }

        builder.fillBody(mediaDetails);
        builder.hookUpToEvents();

        return builder.build();
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