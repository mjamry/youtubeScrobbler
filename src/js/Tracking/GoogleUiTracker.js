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
        $(playlistConfig.ClearButton).click($.proxy(function handleClearPlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaylistControl+"_clear");
        },
        this));

        $(playlistConfig.SaveButton).click($.proxy(function handleSavePlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaylistControl+"_save");
        },
        this));

        $(playlistConfig.ShuffleButton).click($.proxy(function handleShufflePlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaylistControl+"_shuffle");
        },
        this));

        $(playlistConfig.RepeatButton).click($.proxy(function handleRepeatPlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.PlaylistControl+"_repeat");
        },
        this));
    },

    hookUpToTestControlEvents: function(testConfig)
    {
        $(testConfig.ErrorButton).click($.proxy(function handleErrorReportOpen()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.TestEnvironment+"_error_report");
        },
        this));

        $(testConfig.FeatureButton).click($.proxy(function handleFeatureRequestOpen()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.ClickAction, this.config.TestEnvironment+"_feature_request");
        },
        this));
    },

    hookUpToLoggerControlEvents: function(loggerConfig)
    {

    }
};