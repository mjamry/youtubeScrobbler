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
Logger = function(){};

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