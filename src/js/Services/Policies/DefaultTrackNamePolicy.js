window.Services = window.Services || {};

window.Services.DefaultTrackNamePolicy = function()
{
    this.REGEX_NAMING_PATTERN = "([^\\-]*)-\\s?((?:[^\\{\\}\\(\\)\\[\\]]?)*)(.*)";
};

window.Services.DefaultTrackNamePolicy.prototype =
{
    parse: function(name)
    {
        var namePattern = RegExp(this.REGEX_NAMING_PATTERN);
        var names = namePattern.exec(name);

        if(names)
        {
            return {
                artist: names[1],
                title: names[2]
            };
        }

        Logger.getInstance().warning("Error occurs while parsing track title. Incorrect naming pattern: "+name);
        return null;
    }
};