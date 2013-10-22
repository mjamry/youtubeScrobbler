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
    _handlePlaySpecificRequest: function(index)
    {
        this.playlistService.playSpecific(index);
    },

    initialise: function()
    {
        this.onlineScrobbler.initialise();
        //hook up to UI events - mainly to control player/playlist
        var eventBroker = window.Common.EventBrokerSingleton.instance();
        eventBroker.addListener(window.UI.Events.PlayNextRequested, this.playlistService.playNext, null, this);
        eventBroker.addListener(window.UI.Events.PlayPreviousRequested, this.playlistService.playPrevious, null, this);
        eventBroker.addListener(window.UI.Events.PlaySpecificRequested, this._handlePlaySpecificRequest, null, this);
    },

    createNewSession: function(token)
    {
        this.onlineScrobbler.createNewSession(token);
    },

    createNewPlaylist: function(url)
    {
        var plLoader = new window.Player.YouTubePlaylistLoader();
        plLoader.loadPlaylistFromUrl(
            url,
            $.proxy(function(playlist)
            {
                this.playlistService.createPlaylist(playlist);
            }, this)
        );
    },

    addToPlaylist: function(url)
    {
        var plLoader = new window.Player.YouTubePlaylistLoader();
        plLoader.loadPlaylistFromUrl(
            url,
            $.proxy(function(playlist)
            {
                this.playlistService.addToPlaylist(playlist)
            }, this)
        );
    }
}
