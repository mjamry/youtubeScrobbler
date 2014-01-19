//namespace
window.Tracking = window.Tracking || {};

window.Tracking.GoogleUiTracker = function(config)
{
    this.config = config;
};

window.Tracking.GoogleUiTracker.prototype =
{
    hookUpToPlaybackControlEvents: function (playbackConfig)
    {
        $(playbackConfig.PlayButton).click($.proxy(function handlePlayClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaybackControl+"_play");
        },
        this));

        $(playbackConfig.PauseButton).click($.proxy(function handlePauseClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaybackControl+"_pause")
        },
        this));

        $(playbackConfig.NextButton).click($.proxy(function handleNextClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaybackControl+"_next");
        },
        this));

        $(playbackConfig.PreviousButton).click($.proxy(function handlePreviousClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaybackControl+"_previous");
        },
        this));

        $(playbackConfig.VolumeButton).click($.proxy(function handleVolumeClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaybackControl+"_volume");
        },
        this));
    },

    hookUpToPlaylistControlEvents: function(playlistConfig)
    {

    },

    hookUpToTestControlEvents: function(testConfig)
    {

    },

    hookUpToLoggerControlEvents: function(loggerConfig)
    {

    }
};