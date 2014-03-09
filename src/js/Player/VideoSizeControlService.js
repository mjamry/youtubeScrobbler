//using
window.Player = window.Player || {};

window.Player.VideoSizeControl = function(player)
{
    this.player = player;
};

window.Player.VideoSizeControl.prototype =
{
    initialise: function videoSizeControlInitialise()
    {

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
        this.player.setSize(window.screen.width, window.screen.height);
    },

    setFullScreenModeOff: function()
    {

    }
};