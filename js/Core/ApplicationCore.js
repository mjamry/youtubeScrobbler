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
        //hook up to UI events - mainly to control player/playlist
        var eventBroker = window.Common.EventBrokerSingleton.instance();
        eventBroker.addListener(window.UI.Events.playNextRequested, this.playlistService.playNext, null, this.playlistService);
        eventBroker.addListener(window.UI.Events.playPreviousRequested, this.playlistService.playPrevious, null, this.playlistService);
    },

    createNewSession: function(token)
    {
        this.onlineScrobbler.createNewSession(token);
    },

    play: function(url)
    {
        var plLoader = new window.Player.YouTubePlaylistLoader();
        plLoader.loadPlaylistFromUrl(
            url,
            $.proxy(function(playlist){
                playlist.next();
                playlist.next();
                this.playlistService.setUpPlaylist(playlist);
            }, this)
        );
    }
}
