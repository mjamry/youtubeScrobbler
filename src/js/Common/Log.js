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

//simple implementation of Logger
//it just write to console window.
LoggerImpl = function()
{
    this._eventBroker = null;
    this.referenceTime = new Date();
};

LoggerImpl.prototype =
{
    _getFormatedTimestamp: function()
    {
        //calculate elapsed time and format is as a date
        var timeFromAppInitialisation = new Date() - this.referenceTime;
        var date = new Date(0, 0, 0, 0, 0, 0);
        date.setMilliseconds(timeFromAppInitialisation);

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
        message = "[ERR]" + this._getFormatedTimestamp() + message + new Error().stack;
        console.error(message);
        if(this._eventBroker)
        {
            this._eventBroker.fireEventWithData(window.Common.LoggerEvents.LoggerError, message);
            console.trace();
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