//namespace
window.Playlist = window.Playlist || {};

window.Playlist.PlaylistElementLoveStateModifier = function(innerModifier, sessionProvider)
{
    this.innerModifier = innerModifier;
    this.sessionProvider = sessionProvider;
};

window.Playlist.PlaylistElementLoveStateModifier.prototype =
{
    love: function(mediaDetails, index, callbacks)
    {
        var details =
        {
            details: mediaDetails,
            index: index
        };

        var done = callbacks.done;
        callbacks.done = function trackLoved(index, mediaDetails)
        {
            mediaDetails.loved = true;
            done(index, mediaDetails);
        };

        this.innerModifier.love(details, this.sessionProvider.getSession(), callbacks);
    },

    unlove: function(mediaDetails, index, callbacks)
    {
        var details =
        {
            details: mediaDetails,
            index: index
        };

        var done = callbacks.done;
        callbacks.done = function trackLoved(index, mediaDetails)
        {
            mediaDetails.loved = false;
            done(index, mediaDetails);
        };

        this.innerModifier.unLove(details, this.sessionProvider.getSession(), callbacks);
    }
};

