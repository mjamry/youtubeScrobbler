//namespace
window.Common = window.Common || {};

TimeParser = function()
{
    TimeParser._instance = null;
};

TimeParser.getInstance = function()
{
    if(TimeParser._instance === null)
    {
        var errorMsg = "Instance of TimeParser has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return TimeParser._instance;
};

TimeParser.setInstance = function(instance)
{
    if(TimeParser._instance !== null)
    {
        var errorMsg = "Instance of TimeParser has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    TimeParser._instance = instance;
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

    getHumanReadableTimeFormat: function(timeInSeconds)
    {
       timeInSeconds = Math.round(timeInSeconds);

       var secs = timeInSeconds % this.SecondsInMinute;
       var mins = parseInt(timeInSeconds / this.SecondsInMinute, 10);

       if(mins >= this.MinutesInHour)
       {
           var hours = parseInt(mins / this.MinutesInHour, 10);
           mins = mins - hours * this.MinutesInHour;

           return hours + ":" + this._timeCorrection(mins) + ":" + this._timeCorrection(secs);
       }

       return mins + ":" + this._timeCorrection(secs);
    },

    getHumanReadableDurationFormat: function(duration)
    {
        //TODO parse PTH1M2S33
        return duration;
    }
};




