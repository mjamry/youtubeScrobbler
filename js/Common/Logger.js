//namespace
window.Common = window.Common || {};

window.Common.Log = function(){};

window.Common.Log.SetInsance = function(instance)
{
    this.instance = instance;
    this.instance.Info("Logger has been initialised.");
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

//simple implementation of Logger
//it just write to console window.
Logger = function(){};

Logger.prototype =
{
    _getFormatedTimestamp: function()
    {
        var date = new Date();
        var outputData =
            "[" +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            date.getSeconds() + "." +
            date.getMilliseconds() +
            "] ";
        return outputData;
    },

    Info: function(message)
    {
          console.info(this._getFormatedTimestamp() + message);
    },

    Error: function(message)
    {
        console.error(this._getFormatedTimestamp()  +message);
    },

    Warning: function(message)
    {
        console.warn(this._getFormatedTimestamp() + message);
    },

    Debug: function(message)
    {
        console.debug(this._getFormatedTimestamp() + message);
    }
}

//TODO: need to be moved to more apropriate place
window.Common.Log.SetInsance(new Logger());
