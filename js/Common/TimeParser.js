//namespace
window.Common = window.Common || {};

TimeParser = function()
{
    this._instance = null;
};

TimeParser.getInstance = function()
{
    if(this._instance == null)
    {
        var errorMsg = "Instance of TimeParser has not been set yet!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    return this._instance;
};

TimeParser.setInstance = function(instance)
{
    if(this._instance != null)
    {
        var errorMsg = "Instance of TimeParser has been already set!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    this._instance = instance;
};

window.Common.TimeParserImpl = function(){};

window.Common.TimeParserImpl.prototype =
{
    getMinutes: function(timeInMs)
    {
        //it is in ms so it must be divided by 1000, also need to be rounded to make an int value
       return Math.round(timeInMs / 1000);
    },

    getSeconds: function(timeInMs)
    {
        return Math.round(timeInMs/60);
    },

    getHumanReadibleFormat: function(timeInSeconds)
    {
       var minuteInSeconds = 60;
       var min = parseInt(timeInSeconds / minuteInSeconds);
       var sec = timeInSeconds % minuteInSeconds;

       return min + ":" + (sec < 10 ? "0" + sec : sec);
    }
};




