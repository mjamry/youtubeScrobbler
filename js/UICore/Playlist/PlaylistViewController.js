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

    this.numberOfNewItems = 0;
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

    _handlePlaylistUpdated: function(numberOfNewItems)
    {
        this.numberOfNewItems = numberOfNewItems;
        if(this.numberOfNewItems > 0)
        {
            $("#playlist-progressbar").show();
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
    },

    //pass only index - details can be obtained
    _handleItemUpdated: function(eventArgs)
    {
        if(this.numberOfNewItems > 0)
        {
            this._updateProgressbar(eventArgs.index);
        }
        var newItem = this._createNewElement(eventArgs.mediaDetails, eventArgs.index);
        this.view.children("div").eq(eventArgs.index).replaceWith(newItem);
    },

    _handleMediaChanged: function(mediaDetails)
    {

    },

    _updateProgressbar: function(itemIndex)
    {
        var progressBarPercentValue = ((this.numberOfNewItems - (this.playlistService.getPlaylist().length() - 1 - itemIndex))/this.numberOfNewItems)*100;
        $("#playlist-progressbar").css({width:progressBarPercentValue+"%"});
        if(progressBarPercentValue == 100)
        {
            $("#playlist-progressbar").hide();
        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._handlePlaylistUpdated, null, this);
        EventBroker.getInstance().addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemUpdated, this._handleItemUpdated, null, this);
    }
};