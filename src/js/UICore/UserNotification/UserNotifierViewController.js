window,UI = window.UI || {};

window.UI.UserNotifierViewController = function(view, configuration)
{
    this.view = view;
    this.config = configuration;
};

window.UI.UserNotifierViewController.prototype =
{
    _handleInfoNotificationRequest: function(args)
    {

    },

    _handleErrorNotificationRequest: function(args)
    {

    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Common.UserNotifierEvents.InfoNotificationRequested, $.proxy(this._handleInfoNotificationRequest, this));
        EventBroker.getInstance().addListener(window.Common.UserNotifierEvents.ErrorNotificationRequested, $.proxy(this._handleErrorNotificationRequest, this));
    }
};