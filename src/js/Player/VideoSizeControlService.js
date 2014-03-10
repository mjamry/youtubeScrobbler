//using
window.Player = window.Player || {};

window.Player.VideoSizeControlService = function(player, fullScreenContainer, config)
{
    this.player = player;
    this.fullScreenContainer = fullScreenContainer;
    this.config = config;
};

window.Player.VideoSizeControlService.prototype =
{
    _checkIfFullScreenModeIsOff: function()
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
        this.player.setSize(this.config.defaultVideoWidth, this.config.defaultVideoHeight);
    },

    _handleFullScreenModeChanged: function()
    {
        //this is called after handling full screen enabled event
        if (this._checkIfFullScreenModeIsOff())
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
            if (this.fullScreenContainer.requestFullscreen)
            {
                this.fullScreenContainer.requestFullscreen();
            }
            else if (this.fullScreenContainer.webkitRequestFullscreen)
            {
                this.fullScreenContainer.webkitRequestFullscreen();
            }
            else if (this.fullScreenContainer.mozRequestFullScreen)
            {
                this.fullScreenContainer.mozRequestFullScreen();
            }
            else if (this.fullScreenContainer.msRequestFullscreen)
            {
                this.fullScreenContainer.msRequestFullscreen();
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
        if(this._checkIfFullScreenModeIsOff())
        {
            this.setFullScreenModeOn();
        }
        else
        {
            this.setFullScreenModeOff();
        }
    }
};