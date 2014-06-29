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
        var progressbarId = this.progressbarService.addNewProgressbar(items.length, "Updating playlist items details.");

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
                    .catch(function()
                    {
                        Logger.getInstance().debug("[PEDP] Error itemIndex: "+itemIndex);
                    })
            },
            Promise.resolve()
        );
    },
};