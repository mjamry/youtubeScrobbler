window.UI = window.UI || {};

window.UI.UserNotificationBuilder = function(configuration)
{
    this.config = configuration;
    this.item = $("#controls-schemes .user-notification").clone();
    this.item.find(this.config.UndoButton).hide();
    this.itemRemoveTimer = null;
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
        this.item.addClass(style);
    },

    _clearNotification: function()
    {
        this.item.slideUp(this.config.AnimationSpeed, function(){this.remove();});
    },

    _setItemRemoveTimer: function()
    {
        this.itemRemoveTimer = window.setTimeout($.proxy(this._clearNotification, this), this.config.NotificationTimeout);
    },

    _killItemRemoveTimer: function()
    {
        if(this.itemRemoveTimer)
        {
            window.clearTimeout(this.itemRemoveTimer);
        }
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
        this.item.find(this.config.UndoButton).click(
            $.proxy(function()
            {
                callback();
                this._clearNotification();
            },
            this));
    },

    build: function()
    {
        this.item.mouseenter($.proxy(this._killItemRemoveTimer, this));
        this.item.mouseleave($.proxy(this._setItemRemoveTimer, this));
        this.item.find(this.config.CloseButton).click($.proxy(this._clearNotification, this));
        this._setItemRemoveTimer();
        return this.item;
    }
};