//using
window.Player = window.Player || {};

window.Player.VideoSizeControl = function(player)
{
    this.player = player;
};

window.Player.VideoSizeControl.prototype =
{
    _handleFullScreenModeOn: function()
    {
        this.player.setSize(window.screen.width, window.screen.height);
    },

    _handleFullScreenModeOff: function()
    {
        this.player.setSize(200, 200);
    },

    _handleFullScreenModeChanged: function()
    {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement )
        {
            this._handleFullScreenModeOff();
        }
        else
        {
            this._handleFullScreenModeOn();
        }
    },

    setFullScreenModeOn: function()
    {
        //var playerContainer = document.getElementById(new window.UI.UIControllersFactory().createUICore().getPlayerContainer());
        var playerContainer = document.getElementById("fullscreen-video-container");
        if (playerContainer.requestFullscreen) {
            playerContainer.requestFullscreen();
        } else if (playerContainer.webkitRequestFullscreen) {
            playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.mozRequestFullScreen) {
            playerContainer.mozRequestFullScreen();
        } else if (playerContainer.msRequestFullscreen) {
            playerContainer.msRequestFullscreen();
        }

        document.addEventListener("fullscreenchange",
            $.proxy(this._handleFullScreenModeChanged, this),
            false);

        document.addEventListener("mozfullscreenchange",
            $.proxy(this._handleFullScreenModeChanged, this),
            false);

        document.addEventListener("webkitfullscreenchange",
            $.proxy(this._handleFullScreenModeChanged, this),
            false);
    },

    setFullScreenModeOff: function()
    {

    }
};