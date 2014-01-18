//namespace
window.Player = window.Player || {};


window.Player.Playlist = function()
{
    this.mediaList = [];
};

window.Player.Playlist.prototype =
{
    currentItemIndex: 0,

    addItem: function(mediaDetails)
    {
         this.mediaList.push(mediaDetails);
    },

    addPlaylist: function(playlist)
    {
        this.mediaList = this.mediaList.concat(playlist.mediaList);
    },

    get: function(index)
    {
        return this.mediaList[index];
    },

    remove: function(index)
    {
          this.mediaList.splice(index, 1);
    },

    replace: function(index, mediaDetails)
    {
        this.mediaList[index] = mediaDetails;
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

    length: function()
    {
        return this.mediaList.length;
    },

    //TODO remember to update currentIndex after changing playlist items order
    shuffle: function()
    {
        //implementation of Fisher-Yates shuffle algorithm
        //http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

        for(var i = this.length() - 1; i >= 0; i--)
        {
            //0 ≤ j ≤ i
            var j = Math.floor(Math.random() * i);

            //need to update current item index after shuffling
            if(this.currentItemIndex == i)
            {
                this.currentItemIndex = j;
            }
            else if(this.currentItemIndex == j)
            {
                this.currentItemIndex = i;
            }

            //exchange [j] <-> [i]
            var temp = this.mediaList[i];
            this.mediaList[i] = this.mediaList[j];
            this.mediaList[j] = temp;
        }
    }
};