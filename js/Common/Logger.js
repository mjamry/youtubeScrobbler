//namespace
window.Common = window.Common || {};

//TODO add possibility to set logging level
window.Common.Log = function(){};

window.Common.Log.SetInsance = function(instance)
{
    if(this.instance !== "undefined")
    {
        this.instance = instance;
        this.instance.Info("Logger has been initialised.");
    }
}

window.Common.Log.Instance = function()
{
    if(this.instance === 'undefined')
    {
        throw "Logger has not been initialised  yet."
    }
    else
    {
        return this.instance;
    }
}

//TODO move it to common namespace
//simple implementation of Logger
//it just write to console window.
Logger = function()
{
    this._eventBroker = null;
};

Logger.prototype =
{
    _getFormatedTimestamp: function()
    {
        var date = new Date();
        var ms = date.getMilliseconds();
        var s = date.getSeconds();

        s = s < 10 ? "0" + s : s;
        ms = ms < 100 ? (ms < 10 ? "00" + ms : "0" + ms) : ms;

        var outputData =
            "[" +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            s + "." +
            ms +
            "] ";
        return outputData;
    },

    initialise: function()
    {
        this._eventBroker = window.Common.EventBrokerSingleton.instance();
    },

    Info: function(message)
    {
        message = "[INF]" + this._getFormatedTimestamp() + message;
        console.info(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggedInfo, message);
        }
    },

    Error: function(message)
    {
        message = "[ERR]" + this._getFormatedTimestamp() + message;
        console.error(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggerError, message);
        }
    },

    Warning: function(message)
    {
        message = "[WRN]" + this._getFormatedTimestamp() + message;
        console.warn(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggerWarning, message);
        }
    },

    Debug: function(message)
    {
        message = "[DBG]" + this._getFormatedTimestamp() + message;
        console.debug(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggerDebug, message);
        }
    }
}