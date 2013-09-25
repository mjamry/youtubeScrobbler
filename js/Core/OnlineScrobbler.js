//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};
window.Common = window.Common || {};
window.LastFm = window.LastFm || {};

window.ApplicationCore.OnlineScrobbler = function()
{
    this._sessionObject = null;
    this._player = null;
    this._lastFmFactory = new window.LastFm.LastFmApiFactory();
    this._lastFmInformationProvider = this._lastFmFactory.createInformationProvider();
    this._scrobbler = this._lastFmFactory.createScrobbler();
    this._player = null;
};

window.ApplicationCore.OnlineScrobbler.prototype =
{
    getPlayer: function()
    {
        return this._player;
    },

    createNewSession: function(token)
    {
        var sessionHandler = this._lastFmFactory.createSessionHandler();
        sessionHandler.createNewSession(
            token,
            $.proxy(function(sessionObject)
            {
                this._sessionObject = sessionObject;
            }, this)
        )
    },

    initialisePlayer: function(playerConfiguration, playerContainer, playlistContainer, timeElapsedContainer)
    {
        var configuration = $.extend(
            {
                playlistAppendTo: playlistContainer,
                timeAppendTo: timeElapsedContainer
            },
            playerConfiguration
        );

        _viewUpdater = new viewUpdater();

        this._player = new window.Player.YouTubePlayer(configuration, playerContainer);
        this._player.addListener(window.Player.Events.videoLoaded, VideoLoaded);

        this._player.addListener(
            window.Player.Events.playlistReady,
            $.proxy(function()
            {
                _viewUpdater.updatePlaylist(this._player.getPlaylistLength());
            }, this)
        );

        this._player.addListener(window.Player.Events.videoPaused,
            $.proxy(function()
            {
                _viewUpdater.updateVideoTitle("Paused: "+this._player.getCurrentVideo().name);
            }, this)
       );

        this._player.addListener(
            window.Player.Events.videoPlay,
            $.proxy(function(video)
            {
                _viewUpdater.updateVideoTitle("Playing: " + video.name + " (" + video.durationInMinutes + ")");
                this._lastFmInformationProvider.getArtist(video.artist, _viewUpdater.updateArtistInfo);
                this._scrobbler.updateNowPlaying(
                    {
                        track: video.title,
                        artist: video.artist
                    },
                    this._sessionObject,
                    {
                        success:  function(response)
                        {
                            window.Common.Log.Instance().Info("LastFm NowPlaying successfuly updated: "+ response.nowplaying.track);
                        },
                        error: function(e)
                        {
                            window.Common.Log.Instance().Error("LastFm NowPlaying update failed: "+ e.message);
                        }
                    }

                );
                this._scrobbler.scrobble(
                    {
                        track: video.title,
                        artist: video.artist,
                        //it is in ms so it must be divided by 1000, also need to be rounded to make an int value
                        timestamp:  Math.round((new Date()).getTime() / 1000)
                    },
                    this._sessionObject,
                    {
                        success:  function(response)
                        {
                            window.Common.Log.Instance().Info("LastFm Scrobbling successfuly updated: "+ response.scrobbles.scrobble);
                        },
                        error: function(e)
                        {
                            window.Common.Log.Instance().Error("LastFm Scrobbling update failed: "+ e.message);
                        }
                    }

                );

            }, this)
        );
    }
};
