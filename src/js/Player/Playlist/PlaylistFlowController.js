//namespace
window.Playlist = window.Playlist || {};

//it is responsible for selecting items from playlist and stores playlist state.
window.Playlist.PlaylistFlowController = function(playlistProvider)
{
    this.playlistProvider = playlistProvider;
    this.isLoopModeOn = false;
    this.currentItemIndex = 0;
};

window.Playlist.PlaylistFlowController.prototype =
{
    getNext: function()
    {
        var playlist = this.playlistProvider.getPlaylist();
        this.currentItemIndex++;
        if(this.currentItemIndex == playlist.length())
        {
            if( !this.isLoopModeOn)
            {
                this.currentItemIndex = playlist.length() - 1;
                return null;
            }
            else
            {
                //jump to the first one
                this.currentItemIndex = 0;
            }
        }

        return playlist.get(this.currentItemIndex);
    },

    getPrevious: function()
    {
        var playlist = this.playlistProvider.getPlaylist();
        this.currentItemIndex--;
        if(this.currentItemIndex < 0)
        {
            if( !this.isLoopModeOn)
            {
                this.currentItemIndex = 0;
                return null;
            }
            else
            {
                //jump to the last one
                this.currentItemIndex = playlist.length() - 1;
            }
        }

        return playlist.get(this.currentItemIndex);
    },

    shuffle: function()
    {
        this.playlistProvider.getPlaylist().shuffle();
        this.playlistProvider.refreshPlaylist();
    },

    getSpecific: function(index)
    {
        var playlist = this.playlistProvider.getPlaylist();
        if(index >= 0 && index < playlist.length())
        {
            this.currentItemIndex = index;
            return playlist.get(index);
        }

        return null;
    },

    toggleLoopMode: function()
    {
        this.isLoopModeOn = !this.isLoopModeOn;
        return this.isLoopModeOn;
    },

    getCurrentItemIndex: function()
    {
        return this.currentItemIndex;
    }
};