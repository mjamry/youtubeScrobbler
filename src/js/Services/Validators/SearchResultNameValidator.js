window.Services = window.Services || {};

window.Services.SearchResultNameValidator = function(trackNamePolicy, playlistNamePolicy)
{
    this.trackNamePolicy = trackNamePolicy;
    this.playlistNamePolicy = playlistNamePolicy;
};

window.Services.SearchResultNameValidator.prototype =
{
    //details scheme:
    //{name, isPlaylist}
    isNameCorrect: function(details)
    {
        if(details.isPlaylist)
        {
            var playlistName = this.playlistNamePolicy.parse(details.name);
            return playlistName !== null;
        }

        var trackName = this.trackNamePolicy.parse(details.name);
        return trackName !== null;
    }
};