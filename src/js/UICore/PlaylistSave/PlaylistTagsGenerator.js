window.UI = window.UI || {};

window.UI.PlaylistTagsGenerator = function()
{
    this.NB_OF_TOP_TAGS = 10;
};

window.UI.PlaylistTagsGenerator.prototype =
{
    _tagSortFunction: function(a, b)
    {
        if(a.count < b.count)
            return 1;
        if(a.count > b.count)
            return -1;
        return 0;
    },

    _countTags: function(playlist)
    {
        var allTagsWithCount = [];

        //count how many times each tag occurs on the playlist's tracks
        for(var i=0;i<playlist.length();i++)
        {
            var trackTags = playlist.get(i).tags;

            for(var j=0;j<trackTags.length;j++)
            {
                if(!allTagsWithCount.hasOwnProperty(trackTags[j].name))
                {
                    allTagsWithCount[trackTags[j].name] =
                    {
                        tag: trackTags[j],
                        count: 0
                    };
                }

                allTagsWithCount[trackTags[j].name].count++;
            }
        }

        return allTagsWithCount;
    },

    _sortTags: function(tagsToSort)
    {
        var sortedTags = [];
        var i = 0;
        //need to create an array with numeric indexes to be able to sort it
        for(var key in tagsToSort)
        {
            sortedTags[i] = tagsToSort[key].tag;
            i++;
        }

        //sort tags by number of occurences
        sortedTags.sort(this._tagSortFunction);

        return sortedTags;
    },

    _getTopTags: function(allTags)
    {
        return allTags.slice(0, this.NB_OF_TOP_TAGS);
    },

    generate: function(playlist)
    {
        var countedTags = this._countTags(playlist);
        var sortedTags = this._sortTags(countedTags);

        return this._getTopTags(sortedTags);
    },
};