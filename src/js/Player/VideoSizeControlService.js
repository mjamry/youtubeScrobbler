//using
window.Player = window.Player || {};

window.Player.VideoSizeControlService = function(player)
{
    this.player = player;
};

window.Player.VideoSizeControlService.prototype =
{
    _checkIfFullScreenModeIsOn: function()
    {
        return (!document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement);
    },

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
        if (this._checkIfFullScreenModeIsOn())
        {
            this._handleFullScreenModeOff();
        }
        else
        {
            this._handleFullScreenModeOn();
        }
    },

    initialise: function videoSizeControlInitialise()
    {
        //this is needed to support all types of browsers
        document.addEventListener
            (
                "fullscreenchange",
                $.proxy(this._handleFullScreenModeChanged, this),
                false
            );

        document.addEventListener
            (
                "mozfullscreenchange",
                $.proxy(this._handleFullScreenModeChanged, this),
                false
            );

        document.addEventListener
            (
                "webkitfullscreenchange",
                $.proxy(this._handleFullScreenModeChanged, this),
                false
            );
    },

    setFullScreenModeOn: function()
    {
        //first check if fullscreen is available
        if(document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled)
        {
            var playerContainer = document.getElementById("fullscreen-video-container");
            if (playerContainer.requestFullscreen)
            {
                playerContainer.requestFullscreen();
            }
            else if (playerContainer.webkitRequestFullscreen)
            {
                playerContainer.webkitRequestFullscreen();
            }
            else if (playerContainer.mozRequestFullScreen)
            {
                playerContainer.mozRequestFullScreen();
            }
            else if (playerContainer.msRequestFullscreen)
            {
                playerContainer.msRequestFullscreen();
            }
        }
    },

    setFullScreenModeOff: function()
    {
        if (document.exitFullscreen)
        {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen)
        {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen();
        }
    },

    toggleFullScreenMode: function()
    {
        if(this._checkIfFullScreenModeIsOn())
        {
            this.setFullScreenModeOff();
        }
        else
        {
            this.setFullScreenModeOn();
        }
    }
};