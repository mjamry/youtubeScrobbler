window.UI = window.UI || {};

window.UI.UserNotifierViewController = function(view, configuration)
{
    this.view = $(view);
    this.config = configuration;
};

window.UI.UserNotifierViewController.prototype =
{
    _handleInfoNotificationRequest: function(args)
    {
        var builder = new window.UI.UserNotificationBuilder(this.config);
        builder.setNotificationType(window.UI.UserNotificationTypes.Info);
        builder.setMessage(args.message);
        if(args.callback)
        {
            builder.setUndoAction(args.callback);
        }
        var notification = builder.build();

        this.view.append(notification);
    },

    _handleErrorNotificationRequest: function(args)
    {
        var builder = new window.UI.UserNotificationBuilder(this.config);
        builder.setNotificationType(window.UI.UserNotificationTypes.Error);
        builder.setMessage(args.message);
        var notification = builder.build();

        this.view.append(notification);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Common.UserNotifierEvents.InfoNotificationRequested, $.proxy(this._handleInfoNotificationRequest, this));
        EventBroker.getInstance().addListener(window.Common.UserNotifierEvents.ErrorNotificationRequested, $.proxy(this._handleErrorNotificationRequest, this));
    }
};