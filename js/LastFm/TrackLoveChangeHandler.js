//namespace
window.LastFm = window.LastFm || {};

window.LastFm.TrackLoveChangeHandler = function(stateChangeExecutor, sessionProvider)
{
    this._stateChangeExecutor = stateChangeExecutor;
    this._sessionProvider = sessionProvider;
};

window.LastFm.TrackLoveChangeHandler.prototype =
{
    changeLoveState: function(mediaDetails, index)
    {
        var details =
        {
            track: mediaDetails.title,
            artist: mediaDetails.artist,
            index: index
        }

        if(mediaDetails.loved)
        {
            this._stateChangeExecutor.unLove(details, this._sessionProvider.getSession());
        }
        else
        {
            this._stateChangeExecutor.love(details, this._sessionProvider.getSession());
        }
    }
};

