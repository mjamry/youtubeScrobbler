//namespace
window.Player = window.Player || {};

window.Player.Duration = function(duration)
{
    this.duration = duration;
};

window.Player.Duration.prototype =
{
    getInSeconds: function()
    {
        //TODO - format as seconds
        return this.duration;
    },

    ///change length in seconds to human readable format, containing minutes and seconds.
    getHumanReadable: function()
    {
        return TimeParser.getInstance().getHumanReadableDurationFormat(this.duration);
    }
};
