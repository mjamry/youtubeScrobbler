//namespace
window.UI = window.UI || {};

//using
window.Player = window.Player || {};


window.UI.PlaylistViewController = function(playlistService, playlistControlService, view, config)
{
    this.playlistService = playlistService;
    this.playlistControlService = playlistControlService;
    this.view = $("#"+view);
    this.config = config;
};

window.UI.PlaylistViewController.prototype =
{
    _like: function(index)
    {
        this.playlistService.changeLoveState(index);
    },

    _remove: function(index)
    {
        this.playlistService.removeItem(index);
    },

    _play: function(index)
    {
        this.playlistControlService.playSpecific(index);
    },

    _createNewElement: function(mediaDetails, index)
    {
        var builder = new window.UI.PlaylistUIItemBuilder(index, this.config);
        builder.initialise();

        var isIndexEven = index%2 == 0;

        //add style
        if(isIndexEven)
        {
            builder.setUpStyles(this.config.evenElementStyle);
        }
        else
        {
            builder.setUpStyles(this.config.oddElementStyle);
        }

        builder.fillBody(mediaDetails);
        builder.hookUpToEvents(this, this._play, this._like, this._remove);

        return builder.build();
    },

    _handlePlaylistUpdated: function(playlist)
    {
        //clear view
        this.view.empty();
        var playlist = this.playlistService.getPlaylist();

        for(var i=0; i < playlist.length(); i++)
        {
            var item = playlist.get(i);
            if(item)
            {
                var newElement = this._createNewElement(item, i);
                this.view.append(newElement);
            }
        }
    },

    //pass only index - details can be obtained
    _handleItemUpdated: function(eventArgs)
    {
        var newItem = this._createNewElement(eventArgs.mediaDetails, eventArgs.index);
        this.view.children("div").eq(eventArgs.index).replaceWith(newItem);
    },

    _handleMediaChanged: function(mediaDetails)
    {

    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._handlePlaylistUpdated, null, this);
        EventBroker.getInstance().addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemUpdated, this._handleItemUpdated, null, this);
    }
};