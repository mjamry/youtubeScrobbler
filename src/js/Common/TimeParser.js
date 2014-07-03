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
    this.DURATION_HOUR_INDEX = 5;
    this.DURATION_MINUTES_INDEX = 6;
    this.DURATION_SEC_INDEX = 7;
};

window.Common.TimeParserImpl.prototype =
{
    _timeCorrection: function(time)
    {
        return (time < 10 ? "0" + time : time);
    },

    _parseDuration: function(duration)
    {
        var durationPattern = RegExp(this.DURATION_PATTERN);
        return durationPattern.exec(duration);
    },

    getMinutes: function(timeInMs)
    {
       return Math.round(timeInMs / this.MsInSecond / this.SecondsInMinute);
    },

    getSeconds: function(timeInMs)
    {
        return Math.round(timeInMs / this.MsInSecond);
    },

    getSecondsFromDuration: function(duration)
    {

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
        var time = this._parseDuration(duration);
        var hours, mins, secs;
            hours = time[this.DURATION_HOUR_INDEX] ? time[this.DURATION_HOUR_INDEX].substring(0, time[this.DURATION_HOUR_INDEX].length - 1) : "";
            mins = time[this.DURATION_MINUTES_INDEX] ? time[this.DURATION_MINUTES_INDEX].substring(0, time[this.DURATION_MINUTES_INDEX].length - 1) : "0";
            secs = time[this.DURATION_SEC_INDEX] ? time[this.DURATION_SEC_INDEX].substring(0, time[this.DURATION_SEC_INDEX].length - 1) : "0";

        //if hour value is defined return time in format h:m:s otherwise only m:s
        return hours ?
            hours+":"+this._timeCorrection(mins)+":"+this._timeCorrection(secs) :
            mins+":"+this._timeCorrection(secs);
    }
};




