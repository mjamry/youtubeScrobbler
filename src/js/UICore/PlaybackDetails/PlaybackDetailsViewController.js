//using
window.UI = window.UI || {};

window.UI.PlaybackDetailsViewController = function(model, view, config)
{
    this.view = $("#"+view);
    this.model = model;
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
        var title = this.model.getMediaDetails().artist.name + " - " + this.model.getMediaDetails().title;
        var time = this.model.getPlaybackTime() + "/" + this.model.getDuration();

        this._updateView(this.model.getPlaybackState(), title, time);
        this._updatePageTitle(this.model.getPlaybackState(), title, time);
        this._updatePlaybackProgress(this.model.getPlaybackProgress());
        this._updateDataProgress(this.model.getDataProgress());
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

    _updatePageTitle: function(state, title, time)
    {
        document.title = title+"|"+time;
    },

    _handleControlsDisableRequest: function()
    {
        this.view.find(this.config.PlaybackDetails).html("");
        this.view.find(this.config.PlaybackTime).html("");
        this.view.addClass(this.config.DisabledClass);
        this.areControlsEnabled = false;
        this.model.clearData();
        this._updatePlaybackProgress(0);
        this._updateDataProgress(0);
    },

    _handleControlsEnableRequest: function()
    {
        this.areControlsEnabled = true;
        this.view.removeClass(this.config.DisabledClass);
        this._updatePlaybackProgress(0);
        this._updateDataProgress(0);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.Events.PlaybackDetailsUpdated, this._handleDetailsUpdateRequest, null, this);
        EventBroker.getInstance().addListener(window.UI.Events.DisableControlButtonsRequested, $.proxy(this._handleControlsDisableRequest, this));
        EventBroker.getInstance().addListener(window.UI.Events.EnableControlButtonsRequested, $.proxy(this._handleControlsEnableRequest, this));
        //bind to mouse events
        var mouseEnterHandler = this._handleMouseEnter(this);
        var mouseLeaveHandler = this._handleMouseLeave(this);

        this.view.mouseenter(mouseEnterHandler);
        this.view.mouseleave(mouseLeaveHandler);
    }
};