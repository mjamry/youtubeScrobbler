//namespace
window.UI = window.UI || {};

//using
window.Player = window.Player || {};


window.UI.PlaylistViewController = function(model, view, config)
{
    this._model = model;
    this._container = $("#"+view);
    this._config = config;
    this._eventBroker = EventBroker.getInstance();
};

window.UI.PlaylistViewController.prototype =
{
    _like: function(index)
    {
        this._model.changeLoveState(index);
    },

    _remove: function(index)
    {
        this._model.removeItem(index);
    },

    _play: function(index)
    {
        this._model.playSpecific(index);
    },

    _createNewElement: function(mediaDetails, index)
    {
        var builder = new window.UI.PlaylistUIItemBuilder(index, this._config);
        builder.initialise();

        var isIndexEven = index%2 == 0;

        //add style
        if(isIndexEven)
        {
            builder.setUpStyles(this._config.evenElementStyle);
        }
        else
        {
            builder.setUpStyles(this._config.oddElementStyle);
        }

        builder.fillBody(mediaDetails);
        builder.hookUpToEvents(this, this._play, this._like, this._remove);

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

    _handleItemUpdated: function(eventArgs)
    {
        var newItem = this._createNewElement(eventArgs.mediaDetails, eventArgs.index);
        this._container.children("div").eq(eventArgs.index).replaceWith(newItem);
    },

    _handleMediaChanged: function(mediaDetails)
    {

    },

    initialise: function()
    {
        this._eventBroker.addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._handlePlaylistUpdated, null, this);
        this._eventBroker.addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);

        this._eventBroker.addListener(window.Player.PlaylistEvents.PlaylistItemUpdated, this._handleItemUpdated, null, this);
    }
};