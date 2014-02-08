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
            GoogleTracker.getInstance().trackUiAction(this.config.PlaybackControl, "play");
        },
        this));

        $(playbackConfig.PauseButton).click($.proxy(function handlePauseClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaybackControl, "pause");
        },
        this));

        $(playbackConfig.NextButton).click($.proxy(function handleNextClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaybackControl, "next");
        },
        this));

        $(playbackConfig.PreviousButton).click($.proxy(function handlePreviousClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaybackControl, "previous");
        },
        this));

        $(playbackConfig.VolumeButton).click($.proxy(function handleVolumeClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaybackControl, "volume");
        },
        this));
    },

    hookUpToPlaylistControlEvents: function(playlistConfig)
    {
        $(playlistConfig.ClearButton).click($.proxy(function handleClearPlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaylistControl, "clear");
        },
        this));

        $(playlistConfig.SaveButton).click($.proxy(function handleSavePlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaylistControl, "save");
        },
        this));

        $(playlistConfig.ShuffleButton).click($.proxy(function handleShufflePlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaylistControl, "shuffle");
        },
        this));

        $(playlistConfig.RepeatButton).click($.proxy(function handleRepeatPlaylistClick()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaylistControl, "repeat");
        },
        this));
    },

    hookUpToTestControlEvents: function(testConfig)
    {
        $(testConfig.ErrorButton).click($.proxy(function handleErrorReportOpen()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.TestEnvironment, "open_error_report");
        },
        this));

        $(testConfig.FeatureButton).click($.proxy(function handleFeatureRequestOpen()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.TestEnvironment, "open_feature_request");
        },
        this));

        $(testConfig.ShowFormButton).click($.proxy(function handleTestEnvironmentOpen()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.TestEnvironment, "open_test_environment");
        },
        this));

        $(testConfig.HideFormButton).click($.proxy(function handleTestEnvironmentClose()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.TestEnvironment, "close_test_environment");
        },
        this));
    },

    hookUpToLoggerControlEvents: function(loggerConfig)
    {
        $(loggerConfig.ClearLogsButtonId).click($.proxy(function handleLogsClear()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.LoggerControl, "clear");
        },
        this));

        $(loggerConfig.LoggerLevelComboBox).change($.proxy(function handleLoggerLevelChange()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.LoggerControl, "level_changed", $(loggerConfig.LoggerLevelComboBox).val());
        },
        this));
    },

    hookUpToMediaLoadEvents: function(mediaLoadConfig)
    {
        $(mediaLoadConfig.AddNewMediaButton).click($.proxy(function handleNewMediaAdded()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.MediaLoadControl, "add_new_media_"+$(mediaLoadConfig.MediaLocationInput).val());
        },
        this));
    },

    hookUpToPlaylistItemEvents: function(playlistitemConfig)
    {
        $(playlistitemConfig.PlaylistItem).click($.proxy(function handlePlaylistItemClicked()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaylistItem, "select");
        },
        this));

        $(playlistitemConfig.RemoveButtonContainer).click($.proxy(function handlePlaylistItemRemoved()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaylistItem, "remove");
        },
        this));

        $(playlistitemConfig.LikeButtonContainer).click($.proxy(function handlePlaylistItemLicked()
        {
            GoogleTracker.getInstance().trackUiAction(this.config.PlaylistItem, "licked");
        },
        this));
    },

    hookUpToSessionControlEvents: function(sessionConfig)
    {

    }
};