//namespace
window.Player = window.Player || {};

window.Player.PlaylistElementDetailsProvider = function(playlistProvider, detailsProvider)
{
    this.playlistProvider = playlistProvider;
    this._detailsProvider = detailsProvider;
    this._currentItemIndex = 0;
    this._itemsToGetDetails = 0;
};

window.Player.PlaylistElementDetailsProvider.prototype =
{
    _updateProgressbar: function()
    {
        var progressBarPercentValue = ((this._itemsToGetDetails - (this.playlistProvider.getPlaylist().length() - this._currentItemIndex))/this._itemsToGetDetails)*100;
        $("#playlist-progressbar").css({width:progressBarPercentValue+"%"});
        if(progressBarPercentValue == 100)
        {
            $("#playlist-progressbar").hide();
        }
    },

    _provideDetails: function(mediaDetails)
    {
        //TODO get session while initialisation or while getting details (in case of changes user second option will be better).
        //it fires an PlaylistElementDetailsObtained event
        this._detailsProvider.getTrackDetails(mediaDetails,{user: "onlinescrobbler"});
    },

    _getNextItemDetails: function()
    {
        this._currentItemIndex++;

        this._updateProgressbar();
        //if there is still something to update
        if(this._currentItemIndex < this.playlistProvider.getPlaylist().length())
        {
            this._provideDetails(this.playlistProvider.getPlaylist().get(this._currentItemIndex));
        }
        else
        {
            //clear temp playlist
            this._currentItemIndex = 0;
            this._itemsToGetDetails = 0;
        }
    },

    _handleDetailsObtained: function(mediaDetails)
    {
        this.playlistProvider.updateItem(this._currentItemIndex, mediaDetails);
        //update next item
        this._getNextItemDetails();
    },

    _handleError: function(response)
    {
        //for no - just skip to next element
        //TODO in future error handling should be improved - i.e. try once again with changed media details
        this._getNextItemDetails();
    },

    _handlePlaylistUpdated: function(numberOfNewItems)
    {
        var playlist = this.playlistProvider.getPlaylist();
        this.provideDetails(playlist, playlist.length() - numberOfNewItems);
    },

    //TODO pass here a session provider
    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistUpdated, this._handlePlaylistUpdated, null, this);

        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistElementDetailsObtained, $.proxy(this._handleDetailsObtained, this));
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistElementDetailsObtainingFailed, $.proxy(this._handleError, this));
        //TODO handle unsuccessful details obtaining
    },

    provideDetails: function(playlist, startingIndex)
    {
        this._currentItemIndex = startingIndex;
        this._itemsToGetDetails = playlist.length() - startingIndex;
        $("#playlist-progressbar").show();

        this._provideDetails(this.playlistProvider.getPlaylist().get(this._currentItemIndex));
    }
};