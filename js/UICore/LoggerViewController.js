//namespace
window.UI = window.UI || {};


window.UI.LoggerViewControler = function(container, config)
{
    this._config = config;
    this._container = $("#"+container);
}

window.UI.LoggerViewControler.prototype =
{
    isLoggingAllowed: false,

    _handleLoggedMessage: function(message, style)
    {
        if(this.isLoggingAllowed)
        {
            var newLog = document.createElement(this._config.singleElementType);
            newLog.className = style;
            newLog.innerHTML = message;

            if(this._container.children().length + 1 > this._config.maxNumberOfLogs)
            {
                //remove first element if limit has been reached.
                this._container.find(this._config.singleElementType+':first').remove();
            }

            this._container.append(newLog);
        }
    },

    initialise: function()
    {
        var eventBroker = window.Common.EventBrokerSingleton.instance();

        eventBroker.addListener(window.Common.LoggerEvents.LoggedInfo,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, this._config.infoStyle);
            }, this));

        eventBroker.addListener(window.Common.LoggerEvents.LoggerDebug,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, this._config.debugStyle);
            }, this));

        eventBroker.addListener(window.Common.LoggerEvents.LoggerError,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, this._config.errorStyle);
            }, this));

        eventBroker.addListener(window.Common.LoggerEvents.LoggerWarning,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, this._config.warningStyle);
            }, this));
    }
}