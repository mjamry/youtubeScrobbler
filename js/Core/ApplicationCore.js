//namespace
window.ApplicationCore = window.ApplicationCore || {};

//using
window.UI = window.UI || {};
window.Player = window.Player || {};

window.ApplicationCore.AppCore = function(factory)
{
    window.Common.Cookie.setInstance(factory.createCookieHandler());
    this.uiCore = new window.UI.UICore();
    this.onlineScrobbler = factory.createOnlineScrobbler(window.Common.EventBrokerSingleton.instance());
    this.player = factory.createMediaPlayer(this.uiCore.getPlayerContainer());
    this.playlistService = factory.createPlaylistService(this.player);
};

window.ApplicationCore.AppCore.prototype =
{
    initialise: function()
    {
        this.onlineScrobbler.initialise();
    },

    createNewSession: function(token)
    {
        this.onlineScrobbler.createNewSession(token);
    },

    play: function(url)
    {
        var plLoader = new window.Player.YouTubePlaylistLoader();
        var playlist = plLoader.loadPlaylistFromUrl(
            url,
            $.proxy(function(playlist){
                playlist.next();
                playlist.next();
                this.player.load(playlist.next());
            }, this)
        );


    }
}
