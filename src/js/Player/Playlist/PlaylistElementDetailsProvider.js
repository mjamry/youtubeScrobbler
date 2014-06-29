//namespace
window.Player = window.Player || {};

window.Player.PlaylistElementDetailsProvider = function(detailsProvider, sessionProvider)
{
    this.sessionProvider = sessionProvider;
    this.detailsProvider = detailsProvider;
};

window.Player.PlaylistElementDetailsProvider.prototype =
{
    _obtainDetailsForItem: function(that, itemDetails)
    {
        return new Promise(function(resolve, reject)
        {
            that.detailsProvider.getTrackDetails(
                itemDetails,
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

    //items - is a list containing new items
    //startIndex - is an item index on the playlist - needed for callback
    //callback - method called to update item details
    obtainDetailsForItems: function(items, startIndex, callback)
    {
        var that = this;
        var progressbarId = ProgressbarService.getInstance().addNewProgressbar(items.length, "Updating playlist items details.");

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
                        callback(itemIndex + startIndex, details);
                        ProgressbarService.getInstance().updateProgressbar(progressbarId, progress);
                    })
                    .catch(function()
                    {
                        //don't care about errors, just update progressbar and move on
                        ProgressbarService.getInstance().updateProgressbar(progressbarId, progress);
                    });
            },
            Promise.resolve()
        );
    }
};