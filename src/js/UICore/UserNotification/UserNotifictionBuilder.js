window.UI = window.UI || {};

window.UI.UserNotificationBuilder = function(configuration)
{
    this.config = configuration;
    this.item = $("#controls-schemes .user-notification").clone();
    this.item.find(this.config.UndoButton).hide();
};

window.UI.UserNotificationBuilder.prototype =
{
    _setIcon: function(iconType)
    {
        var icon = document.createElement("i");
        icon.className += iconType;
        this.item.find(this.config.IconContainer).append(icon);
    },

    _setStyle: function(style)
    {
        this.item.find(this.config.MessageContainer).addClass(style);
        this.item.addClass(style);
    },

    setNotificationType: function(notificationType)
    {
        switch(notificationType)
        {
            case window.UI.UserNotificationTypes.Error:
                this._setIcon(this.config.ErrorIconClass);
                this._setStyle(this.config.ErrorClass);
                break;

            case window.UI.UserNotificationTypes.Info:
                this._setIcon(this.config.InfoIconClass);
                this._setStyle(this.config.InfoClass);
                break;
        }
    },

    setMessage: function(message)
    {
        this.item.find(this.config.MessageContainer).append(message);
    },

    setUndoAction: function(callback)
    {
        this.item.find(this.config.UndoButton).show();
        this.item.find(this.config.UndoButton).click(callback);
    },

    getNotification: function()
    {
        return this.item;
    }
};