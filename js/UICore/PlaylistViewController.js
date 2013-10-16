//namespace
window.UI = window.UI || {};

//using
window.Player = window.Player || {};


window.UI.PlaylistViewController = function(playlistContainer)
{
    this._container = $("#"+playlistContainer);
    this._eventBroker = window.Common.EventBrokerSingleton.instance();
};

window.UI.PlaylistViewController.prototype =
{
    _handlePlaylistUpdated: function(playlist)
    {


        for(var i=0; i < playlist.length(); i++)
        {
            var item = playlist.getItem(i);
            if(item)
            {
                var row = document.createElement("div");
                row.innerHTML = item.artist + " - " + item.title + " index: " + i;

                function fireEventWithElementId(eventBroker, index)
                {
                    return function()
                    {
                        eventBroker.fireEventWithData(window.UI.Events.PlaySpecificRequested, index);
                    }
                }

                var onClickHandler = fireEventWithElementId(this._eventBroker, i);


                this._container.append(row);
                row.onclick = onClickHandler;
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