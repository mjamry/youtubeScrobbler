//namespace
window.Common = window.Common || {};

Logger = function()
{
    Logger._instance = null;
};

Logger.getInstance = function()
{
    if(Logger._instance === null)
    {
        throw "Instance of Logger has not been set yet!";
    }

    return Logger._instance;
};

Logger.setInstance = function(instance)
{
    if(Logger._instance !== null)
    {
        throw "Instance of Logger has been already set!";
    }

    Logger._instance = instance;
};

//TODO move it to common namespace
//simple implementation of Logger
//it just write to console window.
LoggerImpl = function()
{
    this._eventBroker = null;
};

LoggerImpl.prototype =
{
    _getFormatedTimestamp: function()
    {
        var date = new Date();
        var ms = date.getMilliseconds();
        var s = date.getSeconds();

        s = s < 10 ? "0" + s : s;
        ms = ms < 100 ? (ms < 10 ? "00" + ms : "0" + ms) : ms;

        return (
            "[" +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            s + "." +
            ms +
            "] ");
    },

    initialise: function()
    {
        this._eventBroker = EventBroker.getInstance();
    },

    info: function(message)
    {
        message = "[INF]" + this._getFormatedTimestamp() + message;
        console.info(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggedInfo, message);
        }
    },

    error: function(message)
    {
        message = "[ERR]" + this._getFormatedTimestamp() + message;
        console.error(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggerError, message);
        }
    },

    warning: function(message)
    {
        message = "[WRN]" + this._getFormatedTimestamp() + message;
        console.warn(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggerWarning, message);
        }
    },

    debug: function(message)
    {
        message = "[DBG]" + this._getFormatedTimestamp() + message;
        console.debug(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggerDebug, message);
        }
    }
};