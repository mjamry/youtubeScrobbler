//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function(factory)
{
    this._uiCore = new window.UI.UICore();
    this._onlineScrobbler = factory.createOnlineScrobbler();
    this._onlineScrobbler.initialisePlayer
    (
        window.Player.Configuration,
        this._uiCore.getPlayerContainer(),
        this._uiCore.getPlaylistContainer(),
        this._uiCore.getTimeElapsedContainer()
    );
};

window.ApplicationCore.AppCore.prototype =
{
    initialise: function()
    {
        //TODO: move here initialisation of services

        this._viewUpdater = new viewUpdater();
        this._onlineScrobbler.attachToEvent(window.Player.Events.videoLoaded, VideoLoaded);

        this._onlineScrobbler.attachToEvent(
            window.Player.Events.playlistReady,
            $.proxy(function()
            {
                this._viewUpdater.updatePlaylist(this._player.getPlaylistLength());
            }, this)
        );

        this._onlineScrobbler.attachToEvent(window.Player.Events.videoPaused,
            $.proxy(function()
            {
                this._viewUpdater.updateVideoTitle("Paused: "+this._player.getCurrentVideo().name);
            }, this)
        );

        this._onlineScrobbler.attachToEvent(
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
    }
}
