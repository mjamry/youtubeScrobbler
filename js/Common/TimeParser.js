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

window.Common.TimeParserImpl = function()
{
    this.MinutesInHour = 60;
    this.SecondsInMinute = 60;
    this.MsInSecond = 1000;
};

window.Common.TimeParserImpl.prototype =
{
    _timeCorrection: function(time)
    {
        return (time < 10 ? "0" + time : time);
    },

    getMinutes: function(timeInMs)
    {
       return Math.round(timeInMs / this.MsInSecond / this.SecondsInMinute);
    },

    getSeconds: function(timeInMs)
    {
        return Math.round(timeInMs / this.MsInSecond);
    },

    getHumanReadableFormat: function(timeInSeconds)
    {
       timeInSeconds = Math.round(timeInSeconds);

       var secs = timeInSeconds % this.SecondsInMinute;
       var mins = parseInt(timeInSeconds / this.SecondsInMinute);

       if(mins > this.MinutesInHour)
       {
           var hours = parseInt(mins / this.MinutesInHour);
           mins = mins - hours * this.MinutesInHour;

           return hours + ":" + this._timeCorrection(mins) + ":" + this._timeCorrection(secs);
       }

       return mins + ":" + this._timeCorrection(secs);
    }
};




