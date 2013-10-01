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

    this._trackStartedTimestamp = null;
};

window.ApplicationCore.OnlineScrobbler.prototype =
{
    _generateTimestamp: function()
    {
        return Math.round((new Date()).getTime() / 1000);
    },

    _initialiseScrobbler: function()
    {
        window.Common.EventBrokerSingleton.instance().addListener(
            window.Player.Events.videoPlay,
            $.proxy(function(video)
            {
                this._trackStartedTimestamp = this._generateTimestamp();
                this._scrobbler.updateNowPlaying(
                    {
                        track: video.title,
                        artist: video.artist
                    },
                    this._sessionObject
                );
            }, this)
        );

        window.Common.EventBrokerSingleton.instance().addListener(
            window.Player.Events.videoStoped,
            $.proxy(function(video)
            {
                this._scrobbler.scrobble(
                    {
                        track: video.title,
                        artist: video.artist,
                        //it is in ms so it must be divided by 1000, also need to be rounded to make an int value
                        timestamp: this._trackStartedTimestamp
                    },
                    this._sessionObject
                );
            }, this)
        )
    },

    //gets player instance
    getPlayer: function()
    {
        return this._player;
    },

    //try to restore last session if it does not exist creates new one.
    createNewSession: function(token)
    {
        var sessionHandler = this._lastFmFactory.createSessionHandler();

        if(!sessionHandler.isSessionAlreadyCreated())
        {
            sessionHandler.createNewSession(
                token,
                $.proxy(function(sessionObject)
                {
                    this._sessionObject = sessionObject;
                }, this)
            )
        }
        else
        {
            this._sessionObject = sessionHandler.getCurrentSessionKey();
        }
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

        //this._player = new window.Player.YouTubePlayer(configuration, playerContainer);
        this._player = new window.Player.MediaPlayer();

        this._initialiseScrobbler();
    }
};
