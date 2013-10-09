//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function(factory)
{
    this._eventBroker = factory.createBrokerHandler();

    window.Common.EventBrokerSingleton.setInstance(this._eventBroker);
    window.Common.Cookie.setInstance(factory.createCookieHandler());
    this._uiCore = new window.UI.UICore();
    this._onlineScrobbler = factory.createOnlineScrobbler(this._eventHandler);
};

window.ApplicationCore.AppCore.prototype =
{
    initialise: function()
    {
        this._onlineScrobbler.initialise
            (
                window.Player.MediaPlayerConfig,
                this._uiCore.getPlayerContainer()
            );

        this._viewUpdater = new viewUpdater();
        this._eventBroker.addListener(window.Player.Events.videoLoaded, VideoLoaded);

        this._eventBroker.addListener(
            window.Player.Events.playlistReady,
            $.proxy(function()
            {
                this._viewUpdater.updatePlaylist(this.getPlayer().getPlaylistLength());
            }, this)
        );

        this._eventBroker.addListener(window.Player.Events.videoPaused,
            $.proxy(function()
            {
                this._viewUpdater.updateVideoTitle("Paused: "+this.getPlayer().getCurrentVideo().name);
            }, this)
        );

        this._eventBroker.addListener(
            window.Player.Events.videoPlay,
            $.proxy(function(video)
                {
                    this._viewUpdater.updateVideoTitle("Playing: " + video.name + " (" + video.durationInMinutes + ")");

                },  this)
        );


    },

    getPlayer: function()
    {
        return this._onlineScrobbler.getPlayer();
    },

    createNewSession: function(token)
    {
        this._onlineScrobbler.createNewSession(token);
    },

    play: function(url)
    {
        var plLoader = new window.Player.YouTubePlaylistLoader();
        var playlist = plLoader.loadPlaylistFromUrl(
            url,
            $.proxy(function(playlist){
                this._onlineScrobbler.getPlayer().load(playlist.first());
            }, this)
        );


    }
}
