//namespace
window.Player = window.Player || {};


window.Player.Playlist = function()
{
    this.mediaList = [];
    this.indexOfCurrentlySelectedMediaElement = 0;
};

window.Player.Playlist.prototype =
{
    add: function(mediaDetails)
    {
         this.mediaList.push(mediaDetails);
    },

    remove: function(mediaDetails)
    {
          //TODO: remove media element from the list
    },

    first: function()
    {
        return this.mediaList[0];
    },

    last: function()
    {
        return this.mediaList[this.lenght() -1];
    },

    next: function()
    {
        if(this.indexOfCurrentlySelectedMediaElement + 1 < this.length() - 1)
        {
              this.indexOfCurrentlySelectedMediaElement++;
        }
        else
        {
            //jump to last one
            this.indexOfCurrentlySelectedMediaElement = this.length() - 1;
        }

        return this.mediaList[this.indexOfCurrentlySelectedMediaElement];
    },

    previous: function()
    {
        if(this.indexOfCurrentlySelectedMediaElement - 1 < 0)
        {
            this.indexOfCurrentlySelectedMediaElement = this.length() -1;
        }
        else
        {
            this.indexOfCurrentlySelectedMediaElement--;
        }

        return this.mediaList[this.indexOfCurrentlySelectedMediaElement];
    },

    lenght: function()
    {
          this.mediaList.length;
    }
}