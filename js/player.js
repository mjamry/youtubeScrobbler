//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.Player = window.Player || {};
window.Common = window.Common || {};
window.LastFm = window.LastFm || {};

var onlineScrobbler;

window.ApplicationCore.OnlineScrobbler = function()
{
    this._sessionObject = null;
    this._player = null;
    this._lastFmFactory = new window.LastFm.LastFmApiFactory();
    this._lastFmInformationProvider = this._lastFmFactory.createInformationProvider();
    this._scrobbler = this._lastFmFactory.createScrobbler();
    this._player;
};

window.ApplicationCore.OnlineScrobbler.prototype =
{
    createSession: function(token)
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

    initialisePlayer: function()
    {
        var a = this._lastFmFactory;
        var config = {
            highDef: 1,
            width:400,
            height:400,
            chromeless: 0,
            showTime: 1,
            showToolbar: false,
            autoPlay: 1,
            repeatPlaylist: 1,
            playlistAppendTo: $("#playlist .content"),
            timeAppendTo: $("#player .time"),
            playlist:
            {
                title: 'Random videos',
                videos: [
                    { id: 'wDowSzVgjXI', title: 'The All Seeing I - Beat Goes On HQ' },
                    { id: 'hPzNl6NKAG0', title: 'Maru the cat' },
                    { id: 'lvpuT3aoypE', title: 'All Online Data Lost After Internet Crash' },
                    { id: 'Kv6Ewqx3PMs', title: 'Mr. Oizo Flat Beat' },
                    { id: 'IAxj2ob_JoU', title: 'Most incredible volcano footage ever' },
                    { id: '3ycBGkLkEkg', title: 'Wingsuit BASE jumping in Baffin Island' }
                ]
            }
        };
        _viewUpdater = new viewUpdater();
        this._player = new window.Player.YouTubePlayer(config, $(".youtube-player"));
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
                        success:  function(s)
                        {
                            window.Common.Log.Instance().Info("LastFm NowPlaying successfuly updated.");
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
                        success:  function(s)
                        {
                            window.Common.Log.Instance().Info("LastFm Scrobbling successfuly updated: "+ s.scrobbles.scrobble);
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
}

$(function()
{
    onlineScrobbler = new window.ApplicationCore.OnlineScrobbler();
    onlineScrobbler.initialisePlayer();

    //_lastFmFactory = new window.LastFm.LastFmApiFactory();

   // InitialisePlayer();
	//InitialiseScrobbler();
    HookUpLoadUrlButtonAction();
    HookUpToolbarButtons();
    HeaderAction();
	var urlPars = new window.Common.UrlParser();
	_token = urlPars.getParameterValue(window.location.href, "token");
    window.Common.Log.Instance().Debug("Token: "+_token+" has been obtained.");


    onlineScrobbler.createSession(_token);
});

function VideoLoaded(video)
{
    $("#player .title").text("Video: "+video.title);
    $("title").text(video.title);
}

function HeaderAction(){
    $(".page-title").bind("click", function()
        {
            var item = $(this).parent();
            var content = item.find(".content");
            if(content.css("display") === "none")
            {
                content.fadeIn();
                item.animate(
                {
                    height: "100%"
                });
            }
            else
            {
                content.fadeOut();
                item.animate(
                {
                    height: "50px"
                });
            }
    });
}

function HookUpToolbarButtons()
{
    onlineScrobbler._player.hookUpButtonAction("play_button", "playVideo");
    onlineScrobbler._player.hookUpButtonAction("pause_button", "pauseVideo");
    onlineScrobbler._player.hookUpButtonAction("next_button", "nextVideo");
    onlineScrobbler._player.hookUpButtonAction("prev_button", "prevVideo");
}



function HookUpLoadUrlButtonAction(){
    $("#loadUrlButton").bind("click", function()
    {
        var url= $("#videoUrl").val();

        onlineScrobbler._player.loadPlaylistFromUrl(url);
    });
}
