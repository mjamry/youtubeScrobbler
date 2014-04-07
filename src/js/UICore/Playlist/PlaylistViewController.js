//namespace
window.UI = window.UI || {};

//using
window.Player = window.Player || {};


window.UI.PlaylistViewController = function(playlistService, playlistControlService, playlistFlowController, view, config)
{
    this.playlistService = playlistService;
    this.playlistFlowController = playlistFlowController;
    this.playlistControlService = playlistControlService;
    this.view = $("#"+view);
    this.config = config;

    this.numberOfNewItems = 0;
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

    _remove: function(index)
    {
        this.playlistService.removeItem(index);
    },

    _play: function(index)
    {
        this._deselectAllItems();
        this.playlistControlService.playSpecific(index);
    },

    _edit: function(index)
    {
        var mediaElement = this.playlistService.getPlaylist().get(index);
        EventBroker.getInstance().fireEventWithData(
            window.Player.PlaylistEvents.PlaylistItemEditionRequested,
            {
                index: index,
                mediaDetails: mediaElement
            }
        );
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
        builder.hookUpToEvents(this, this._play, this._remove, this._edit);

        return builder.build();
    },

    _refreshPlaylistView: function(numberOfNewItems)
    {
        this.numberOfNewItems = numberOfNewItems;
        if(this.numberOfNewItems > 0)
        {
            $(this.config.PlaylistProgressBar).show();
        }
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
        if(this.numberOfNewItems > 0)
        {
            this._updateProgressbar(eventArgs.index);
        }
        var newItem = this._createNewElement(eventArgs.mediaDetails, eventArgs.index);
        this.view.find(this.config.PlaylistItem).eq(eventArgs.index).replaceWith(newItem);
        this._selectItem(this.playlistFlowController.getCurrentItemIndex());
    },

    _handleMediaPlayed: function()
    {
        this._selectItem(this.playlistFlowController.getCurrentItemIndex());
    },

    _updateProgressbar: function(itemIndex)
    {
        var progressBarPercentValue = ((this.numberOfNewItems - (this.playlistService.getPlaylist().length() - 1 - itemIndex))/this.numberOfNewItems)*100;
        $(this.config.PlaylistProgressBar).css({width:progressBarPercentValue+"%"});
        if(progressBarPercentValue == 100)
        {
            $(this.config.PlaylistProgressBar).hide();
            this.numberOfNewItems = 0;
        }
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