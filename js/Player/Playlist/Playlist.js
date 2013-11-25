//namespace
window.Player = window.Player || {};


window.Player.Playlist = function()
{
    this.mediaList = [];
    this.currentItemIndex = 0;
};

window.Player.Playlist.prototype =
{
    isPlaylistLoop: true,

    add: function(mediaDetails)
    {
         this.mediaList.push(mediaDetails);
    },

    remove: function(index)
    {
          this.mediaList.splice(index, 1);
    },

    first: function()
    {
        this.currentItemIndex = 0;
        return this.mediaList[this.currentItemIndex];
    },

    last: function()
    {
        this.currentItemIndex = this.length() -1;
        return this.mediaList[this.currentItemIndex];
    },

    getItem: function(index)
    {
        if(index >= 0 && index < this.length())
        {
            this.currentItemIndex = index;
            return this.mediaList[index];
        }

        return null;
    },

    replace: function(index, mediaDetails)
    {
        this.mediaList[index] = mediaDetails;
    },

    next: function()
    {
        this.currentItemIndex++;
        if(this.currentItemIndex == this.length())
        {

            if( !this.isPlaylistLoop)
            {
                return null;
            }
            //jump to the first one
            this.currentItemIndex = 0;
        }

        return this.mediaList[this.currentItemIndex];
    },

    previous: function()
    {
        this.currentItemIndex--;
        if(this.currentItemIndex < 0)
        {
            if( !this.isPlaylistLoop)
            {
                return null;
            }
            //jump to the last one
            this.currentItemIndex = this.length() - 1;
        }

        return this.mediaList[this.currentItemIndex];
    },

    length: function()
    {
          return this.mediaList.length;
    },

    shuffle: function()
    {
        //implementation of Fisher-Yates shuffle algorithm
        //http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

        for(var i = this.length() - 1; i >= 0; i--)
        {
            //0 ≤ j ≤ i
            var j = Math.floor(Math.random() * i);

            //exchange [j] <-> [i]
            var temp = this.mediaList[i];
            this.mediaList[i] = this.mediaList[j];
            this.mediaList[j] = temp;
        }
    }
};