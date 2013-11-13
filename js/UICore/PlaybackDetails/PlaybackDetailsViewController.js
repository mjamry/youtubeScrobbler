//using
window.UI = window.UI || {};

window.UI.PlaybackDetailsViewController = function(model, view)
{
    this._view = view;
    this._model = model;
};

window.UI.PlaybackDetailsViewController.prototype =
{
    _handleDetailsUpdateRequest: function()
    {

    },

    initialise: function()
    {
        window.Common.EventBrokerSingleton.instance().addListener(window.Player.Events.PlaybackDetailsUpdateRequested, this._handleDetailsUpdateRequest, null, this);
    }
};