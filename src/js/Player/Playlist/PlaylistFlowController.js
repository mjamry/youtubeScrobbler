//namespace
window.Playlist = window.Playlist || {};

//it is responsible for selecting items from playlist and stores playlist state.
window.Playlist.PlaylistFlowController = function(playlistProvider)
{
    this.playlistProvider = playlistProvider;
    this.isLoopModeOn = false;
    this.actionsAllowed = false;
};

window.Playlist.PlaylistFlowController.prototype =
{
    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCreated, $.proxy(function(){this.actionsAllowed = true;}, this));
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistCleared, $.proxy(function(){this.actionsAllowed = false;}, this));
    },

    getNext: function()
    {
        var playlist = this.playlistProvider.getPlaylist();
        playlist.currentItemIndex++;
        if(playlist.currentItemIndex == playlist.length())
        {
            if( !this.isLoopModeOn)
            {
                playlist.currentItemIndex = playlist.length() - 1;
                return null;
            }
            else
            {
                //jump to the first one
                playlist.currentItemIndex = 0;
            }
        }

        return playlist.get(playlist.currentItemIndex);
    },

    getPrevious: function()
    {
        var playlist = this.playlistProvider.getPlaylist();
        playlist.currentItemIndex--;
        if(playlist.currentItemIndex < 0)
        {
            if( !this.isLoopModeOn)
            {
                playlist.currentItemIndex = 0;
                return null;
            }
            else
            {
                //jump to the last one
                playlist.currentItemIndex = playlist.length() - 1;
            }
        }

        return playlist.get(playlist.currentItemIndex);
    },

    shuffle: function()
    {
        if(this.actionsAllowed)
        {
            this.playlistProvider.getPlaylist().shuffle();
            this.playlistProvider.refreshPlaylist();
        }
    },

    getSpecific: function(index)
    {
        var playlist = this.playlistProvider.getPlaylist();
        if(index >= 0 && index < playlist.length())
        {
            playlist.currentItemIndex = index;
            return playlist.get(index);
        }

        return null;
    },

    toggleLoopMode: function(callback)
    {
        if(this.actionsAllowed)
        {
            this.isLoopModeOn = !this.isLoopModeOn;
            callback(this.isLoopModeOn);
        }
    },

    getCurrentItemIndex: function()
    {
        return this.playlistProvider.getPlaylist().currentItemIndex;
    }
};