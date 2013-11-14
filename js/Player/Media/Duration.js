//namespace
window.Player = window.Player || {};

window.Player.Duration = function(durationInSeconds)
{
    this.duration = durationInSeconds;
};

window.Player.Duration.prototype =
{
    getInSeconds: function()
    {
        return this.duration;
    },

    ///change length in seconds to human readable format, containing minutes and seconds.
    getHumanReadable: function()
    {
        return TimeParser.getInstance().getHumanReadableFormat(this.duration);
    }
};
