//namespace
window.Player = window.Player || {};

window.Player.PlaylistElementDetailsProvider = function(detailsProvider)
{
    this._detailsProvider = detailsProvider;
    this._playlist = null;
    this._currentItemIndex = 0;
};

window.Player.PlaylistElementDetailsProvider.prototype =
{
    _provideDetails: function(mediaDetails)
    {
        //TODO get session while initialisation or while getting details (in case of changes user second option will be better).
        //it fires an PlaylistElementDetailsObtained event
        this._detailsProvider.getTrackDetails(mediaDetails,{user: "onlinescrobbler"});
    },

    _handleDetailsObtained: function(mediaDetails)
    {
        //informs rest of the system that element has been updated.
        window.Common.EventBrokerSingleton.instance().fireEventWithData(window.Player.PlaylistEvents.PlaylistItemUpdateRequested, {index: this._currentItemIndex, details: mediaDetails});
        //update next item
        this._currentItemIndex++;

        //if there is still something to update
        if(this._currentItemIndex < this._playlist.length())
        {
            this._provideDetails(this._playlist.getItem(this._currentItemIndex));
        }
        else
        {
            //clear temp playlist
            this._playlist = null;
            this._currentItemIndex = 0;
        }
    },

    //TODO pass here a session identifier.
    initialise: function()
    {
        window.Common.EventBrokerSingleton.instance().addListener(window.Player.PlaylistEvents.PlaylistElementDetailsObtained, $.proxy(this._handleDetailsObtained, this));
        //TODO handle unsuccessful details obtaining
    },

    provideDetails: function(playlist, startingIndex)
    {
        this._playlist = playlist;
        this._currentItemIndex = startingIndex;

        this._provideDetails(this._playlist.getItem(this._currentItemIndex));
    }
};