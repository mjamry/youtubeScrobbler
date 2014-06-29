//namespace
window.Player = window.Player || {};

window.Player.PlaylistElementDetailsProvider = function(detailsProvider, sessionProvider)
{
    this.sessionProvider = sessionProvider;
    this.detailsProvider = detailsProvider;

    //TODO - use as a service, only temporarily here
    this.progressbarService = new window.UI.ProgressbarService();

};

window.Player.PlaylistElementDetailsProvider.prototype =
{
    _updateProgressbar: function(itemIndex, that)
    {
        var progress = itemIndex - (that.playlistProvider.getPlaylist().length() - this.numberOfNewItems);
        that.progressbarService.updateProgressbar(that.progressbarId, progress);
    },

    _handleDetailsObtained: function(itemIndex, that)
    {
        return function(mediaDetails)
        {
            that.playlistProvider.updateItem(itemIndex, mediaDetails);
            itemIndex++;
            that._getDetails(itemIndex, that);
            that._updateProgressbar(itemIndex, that);
        };
    },

    _handleObtainingError: function(itemIndex, that)
    {
        return function()
        {
            //there was an error with downloading details (probably there was something wrong with artist/track name).
            //do not care about that, just get details for next item.
            itemIndex++;
            that._getDetails(itemIndex, that);
            that._updateProgressbar(itemIndex, that);
        };
    },

    _getDetails: function(itemIndex, that)
    {
        if(itemIndex < that.playlistProvider.getPlaylist().length())
        {
            var done = that._handleDetailsObtained(itemIndex, that);
            var fail = that._handleObtainingError(itemIndex, that);

            this.detailsProvider.getTrackDetails(
                that.playlistProvider.getPlaylist().get(itemIndex),
                {
                    user: this.sessionProvider.getSession().name
                },
                {
                    done: done,
                    fail: fail
                }
            );
        }
    },

    _obtainDetailsForItem: function(that, item)
    {
        return new Promise(function(resolve, reject)
        {
            that.detailsProvider.getTrackDetails(
                item.details,
                {
                    user: that.sessionProvider.getSession().name
                },
                {
                    done: resolve,
                    fail: reject
                }
            );
        })
    },

    obtainDetailsForItems: function(items, callback)
    {
        var that = this;
        var sequence = Promise.resolve();
        var progressbarId = this.progressbarService.addNewProgressbar(items.length, "Ladind playlist items details.");


        items.reduce(function(sequence, item, itemIndex)
            {
                var progress = itemIndex + 1;
                return sequence
                    .then(function()
                    {

                        return that._obtainDetailsForItem(that, item);
                    })
                    .then(function(details)
                    {
                        callback(item.index, details);
                        that.progressbarService.updateProgressbar(progressbarId, progress);
                        Logger.getInstance().debug("[PEDP] OK item: "+details.title+" itemIndex: "+itemIndex);
                    })
                    .catch(function(){
                        Logger.getInstance().debug("[PEDP] Error itemIndex: "+itemIndex);
                    })
            },
            Promise.resolve()
        );

        items.forEach(function(item)
        {

        });


    },

    initialise: function()
    {

    }
};