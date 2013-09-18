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
    Info: function(message)
    {
          console.info(message);
    },

    Error: function(message)
    {
        console.error(message);
    },

    Warning: function(message)
    {
        console.warn(message);
    },

    Debug: function(message)
    {
        console.debug(message);
    }
}

//TODO: need to be moved to more apropriate place
window.Common.Log.SetInsance(new Logger());
