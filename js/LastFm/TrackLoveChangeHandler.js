//namespace
window.LastFm = window.LastFm || {};

window.LastFm.TrackLoveChangeHandler = function(stateChangeExecutor, sessionProvider)
{
    this._stateChangeExecutor = stateChangeExecutor;
    this._sessionProvider = sessionProvider;
};

window.LastFm.TrackLoveChangeHandler =
{
    changeLoveState: function(mediaDetails)
    {
        if(mediaDetails.loved)
        {
            this._stateChangeExecutor.unLove(
                {
                    track: mediaDetails.title,
                    artist: mediaDetails.artist
                },
                this._sessionProvider.getSession()
            )
        }
        else
        {
            this._stateChangeExecutor.love(
                {
                    track: mediaDetails.title,
                    artist: mediaDetails.artist
                },
                this._sessionProvider.getSession()
            )
        }
    }
};

