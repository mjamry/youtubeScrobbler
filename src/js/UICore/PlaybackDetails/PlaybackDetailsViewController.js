//using
window.UI = window.UI || {};

window.UI.PlaybackDetailsViewController = function(playbackDetails, playlistDetails, view, config)
{
    this.view = view;
    this.playbackDetails = playbackDetails;
    this.playlistDetails = playlistDetails;
    this.config = config;
    this.areControlsEnabled = false;
};

window.UI.PlaybackDetailsViewController.prototype =
{
    _resizeProgressBar: function(size)
    {
        if(size != this.config.ZeroSizeValue)
        {
            this.view.find(this.config.PlaybackProgressBarContainer).css("height", size);
            this.view.find(this.config.PlaybackProgressBar).css("height", size);
        }
    },

    _resizeDataBar: function(size)
    {
        if(size != this.config.ZeroSizeValue)
        {
            this.view.find(this.config.PlaybackDataBarContainer).css("height", size);
            this.view.find(this.config.PlaybackDataBar).css("height", size);
        }
    },

    _resizeDetails: function(size)
    {
        if(size != this.config.ZeroSizeValue)
        {
            this.view.find(this.config.PlaybackDetailsContainer).css("height", size);
        }
    },

    _resizeControl: function(size)
    {
        if(size != this.config.ZeroSizeValue)
        {
            this.view.css("height", size);
        }
    },

    _handleMouseEnter: function(that)
    {
        return function mouseEnterHandler()
        {
            if(that.areControlsEnabled)
            {
                that._resizeControl(that.config.MouseOverProgressBarSize);
                that._resizeDetails(that.config.MouseOverProgressBarSize);
                that._resizeProgressBar(that.config.MouseOverProgressBarSize);
                that._resizeDataBar(that.config.MouseOverDataBarSize);
            }
        };
    },

    _handleMouseLeave: function(that)
    {
        return function mouseLeaveHandler()
        {
            if(that.areControlsEnabled)
            {
                that._resizeControl(that.config.MouseOutProgressBarSize);
                that._resizeDetails(that.config.MouseOutProgressBarSize);
                that._resizeProgressBar(that.config.MouseOutProgressBarSize);
                that._resizeDataBar(that.config.MouseOutDataBarSize);
            }
        };
    },

    _handleDetailsUpdateRequest: function()
    {
        var title = this.playbackDetails.getMediaDetails().artist.name + " - " + this.playbackDetails.getMediaDetails().title;
        var time = "";
        if(this.playbackDetails.getDuration() !== TimeParser.getInstance().getHumanReadableTimeFormat(0))
        {
            //show time only when duration is properly set
            time = this.playbackDetails.getPlaybackTime() + "/" + this.playbackDetails.getDuration();
        }

        this._updateView(this.playbackDetails.getPlaybackState(), title, time);
        this._updatePageTitle(this.playbackDetails.getPlaybackState(), title, time);
        this._updatePlaybackProgress(this.playbackDetails.getPlaybackProgress());
        this._updateDataProgress(this.playbackDetails.getDataProgress());
    },

    _updatePlaybackProgress: function(percentageProgress)
    {
        this.view.find(this.config.PlaybackProgressBar).css("width", percentageProgress+"%");
    },

    _updateDataProgress: function(percentageProgress)
    {
        this.view.find(this.config.PlaybackDataBar).css("width", percentageProgress+"%");
    },

    _updateView: function(state, title, time)
    {
        this.view.find(this.config.PlaybackDetails).html(state+": "+title);
        this.view.find(this.config.PlaybackTime).html(time);
    },

    _setPageTitle: function(value)
    {
        document.title = value;
    },

    _updatePageTitle: function(state, title, time)
    {
        if(state == window.Player.PlaybackState.Playing)
        {
            title = "\u25b6 "+title;
        }

        this._setPageTitle(title+" | "+time);
    },

    _handleControlsDisableRequest: function()
    {
        this.view.find(this.config.PlaybackDetails).html("");
        this.view.find(this.config.PlaybackTime).html("");
        this.view.addClass(this.config.DisabledClass);
        this.areControlsEnabled = false;
        this.playbackDetails.clearData();
        this._updatePlaybackProgress(0);
        this._updateDataProgress(0);
        this._setPageTitle(this.config.DefaultPageTitle);
    },

    _handleControlsEnableRequest: function()
    {
        this.areControlsEnabled = true;
        this.view.removeClass(this.config.DisabledClass);
        this._updatePlaybackProgress(0);
        this._updateDataProgress(0);
    },

    _handleTrackDetailsEdited: function(eventArgs)
    {
        if(eventArgs.index === this.playlistDetails.getCurrentItemIndex())
        {
            this._handleDetailsUpdateRequest();
        }
    },

    _handlePlayerCreated: function()
    {
        this._handleDetailsUpdateRequest();
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.Events.PlaybackDetailsUpdated, this._handleDetailsUpdateRequest, null, this);
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemUpdated, this._handleTrackDetailsEdited, null, this);
        EventBroker.getInstance().addListener(window.UI.Events.DisableControlButtonsRequested, $.proxy(this._handleControlsDisableRequest, this));
        EventBroker.getInstance().addListener(window.UI.Events.EnableControlButtonsRequested, $.proxy(this._handleControlsEnableRequest, this));
        EventBroker.getInstance().addListener(window.Player.Events.PlayerCreated, this._handlePlayerCreated, null, this);
        //bind to mouse events
        var mouseEnterHandler = this._handleMouseEnter(this);
        var mouseLeaveHandler = this._handleMouseLeave(this);

        this.view.mouseenter(mouseEnterHandler);
        this.view.mouseleave(mouseLeaveHandler);
        this._setPageTitle(this.config.DefaultPageTitle);
    }
};