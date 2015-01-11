window.UI = window.UI || {};

window.UI.PlaylistEditorListViewController = function(view, playlistService, config)
{
    this.view = view;
    this.config = config;
    this.playlistService = playlistService;
};

window.UI.PlaylistEditorListViewController.prototype =
{
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

    _remove: function(index)
    {
        this.playlistService.removeItem(index);
    },

    _createNewElement: function(mediaDetails, index)
    {
        var builder = new window.UI.PlaylistEditorListItemBuilder(index, this.config);
        builder.setUpAlbumName(mediaDetails.album.name);
        builder.setUpArtistAndTrackName(mediaDetails.artist.name, mediaDetails.title);
        builder.setUpMouseClickHandler(this, this._edit);
        builder.setUpRemoveAction(this, this._remove);

        return builder.build();
    },

    _refreshPlaylistView: function(numberOfNewItems)
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
        this.view.find(this.config.EditorListItem).eq(eventArgs.index).replaceWith(newItem);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemUpdated, this._handleItemUpdated, null, this);
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._refreshPlaylistView, null, this);
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, this._refreshPlaylistView, null, this);
    }
};