//namespace
window.UI = window.UI || {};

//using
window.Player = window.Player || {};


window.UI.PlaylistViewController = function(playlistService, playlistControlService,loveStateModifier, view, config)
{
    this.playlistService = playlistService;
    this.playlistControlService = playlistControlService;
    this.loveStateModifier = loveStateModifier;
    this.view = $("#"+view);
    this.config = config;

    this.numberOfNewItems = 0;
};

window.UI.PlaylistViewController.prototype =
{
    changeLoveState: function(index)
    {
        var mediaElement = this.playlistService.getPlaylist().get(index);
        var that = this;
        var done = function trackLoveStateChanged(index, mediaDetails)
        {
            that.playlistService.updateItem(index, mediaDetails);
        };

        if(mediaElement.loved)
        {
            this.loveStateModifier.unlove(mediaElement, index, {done:done});
        }
        else
        {
            this.loveStateModifier.love(mediaElement, index, {done:done});
        }

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
            builder.setUpStyles(this.config.EvenElementStyle);
        }
        else
        {
            builder.setUpStyles(this.config.OddElementStyle);
        }

        builder.fillBody(mediaDetails);
        builder.hookUpToEvents(this, this._play, this.changeLoveState, this._remove);

        return builder.build();
    },

    _handlePlaylistUpdated: function(numberOfNewItems)
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
        $(this.config.PlaylistProgressBar).css({width:progressBarPercentValue+"%"});
        if(progressBarPercentValue == 100)
        {
            $(this.config.PlaylistProgressBar).hide();
            this.numberOfNewItems = 0;
        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._handlePlaylistUpdated, null, this);
        EventBroker.getInstance().addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemUpdated, this._handleItemUpdated, null, this);
    }
};