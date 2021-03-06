//namespace
window.UI = window.UI || {};
window.Player = window.Player || {};

window.UI.PlaylistViewController = function(playlistService, playlistControlService, playlistFlowController, view, config)
{
    this.playlistService = playlistService;
    this.playlistFlowController = playlistFlowController;
    this.playlistControlService = playlistControlService;
    this.view = view;
    this.config = config;
};

window.UI.PlaylistViewController.prototype =
{
    _selectItem: function(index)
    {
        this.view.find(this.config.PlaylistItem).eq(index).addClass(this.config.CurrentElementStyle);
    },

    //removes "selection" class from all items.
    //it is a little bit tricky to get previously played item index without storing it - which is not what we want here - so it is a good idea to just remove selection from all items.
    _deselectAllItems: function()
    {
        this.view.find(this.config.PlaylistItem).removeClass(this.config.CurrentElementStyle);
    },

    _play: function(index)
    {
        this._deselectAllItems();
        this.playlistControlService.playSpecific(index);
    },

    _createNewElement: function(mediaDetails, index)
    {
        var builder = new window.UI.PlaylistUIItemBuilder(index, this.config);
        builder.initialise();

        var isIndexEven = index%2 === 0;

        //add style
        if(isIndexEven)
        {
            builder.setUpStyles(this.config.EvenElementStyle);
        }
        else
        {
            builder.setUpStyles(this.config.OddElementStyle);
        }

        builder.fillBody(mediaDetails);
        builder.hookUpToEvents(this, this._play);
        builder.setupContextMenu(this._createContextMenuForItem(index));

        return builder.build();
    },

    _createContextMenuForItem: function(index)
    {
        var contextMenuBuilder = new window.UI.ContextMenuBuilder(window.UI.ContextMenuConfiguration);
        contextMenuBuilder.addItem(
            {
                icon: this.config.EditIcon,
                label: "Rename",
                action: function()
                {
                    var mediaElement = this.playlistService.getPlaylist().get(index);
                    EventBroker.getInstance().fireEventWithData(
                        window.Player.PlaylistEvents.PlaylistItemEditionRequested,
                        {
                            index: index,
                            mediaDetails: mediaElement
                        }
                    );
                }.bind(this)
            });
        contextMenuBuilder.addSeparator();
        contextMenuBuilder.addItem(
            {
                icon: this.config.DeleteIcon,
                label: "Delete",
                action: function()
                {
                    this.playlistService.removeItem(index);
                }.bind(this)
            });

        return contextMenuBuilder.build();
    },

    _refreshPlaylistView: function()
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

        this._selectItem(this.playlistFlowController.getCurrentItemIndex());
    },

    //pass only index - details can be obtained
    _handleItemUpdated: function(eventArgs)
    {
        var newItem = this._createNewElement(eventArgs.mediaDetails, eventArgs.index);
        this.view.find(this.config.PlaylistItem).eq(eventArgs.index).replaceWith(newItem);
        this._selectItem(this.playlistFlowController.getCurrentItemIndex());
    },

    _handleMediaPlayed: function()
    {
        this._selectItem(this.playlistFlowController.getCurrentItemIndex());
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.Events.MediaChanged, this._deselectAllItems, null, this);
        EventBroker.getInstance().addListener(window.Player.Events.MediaStopped, this._deselectAllItems, null, this);
        EventBroker.getInstance().addListener(window.Player.Events.MediaPlay, this._handleMediaPlayed, null, this);

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemUpdated, this._handleItemUpdated, null, this);
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._refreshPlaylistView, null, this);
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, this._refreshPlaylistView, null, this);
    }
};