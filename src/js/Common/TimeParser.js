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
    this.DURATION_PATTERN = "P([0-9]+Y)?([0-9]+M)?([0-9]+W)?([0-9]+D)?T([0-9]+H)?([0-9]+M)?([0-9]+S)?";
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

        //if hour value is defined return time in format h:m:s otherwise only m:s
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
        var durationPattern = RegExp(this.DURATION_PATTERN);
        var time = durationPattern.exec(duration);
        var hours, mins, secs;
            hours = time[5] ? time[5].substring(0, time[5].length - 1) : "";
            mins = time[6] ? time[6].substring(0, time[6].length - 1) : "0";
            secs = time[7] ? time[7].substring(0, time[7].length - 1) : "0";

        //if hour value is defined return time in format h:m:s otherwise only m:s
        return hours ?
            hours+":"+this._timeCorrection(mins)+":"+this._timeCorrection(secs) :
            mins+":"+this._timeCorrection(secs);
    }
};




