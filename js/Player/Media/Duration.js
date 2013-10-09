//namespace
window.Player = window.Player || {};

window.Player.Duration = function(durationInSeconds)
{
    this.duration = durationInSeconds;
}

window.Player.Duration.prototype =
{
    getInSeconds: function()
    {
        return this.duration;
    },

    ///change length in seconds to human readable format, containing minutes and seconds.
    getHumanReadable: function()
    {
        var minuteInSeconds = 60;
        var min = parseInt(this.duration / minuteInSeconds);
        var sec = this.duration % minuteInSeconds;

        return min + ":" + (sec < 10 ? "0" + sec : sec);
    }
}
