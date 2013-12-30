//using
window.UI = window.UI || {};

window.UI.PlaybackDetailsViewController = function(model, view, config)
{
    this.view = $("#"+view);
    this.model = model;
    this.config = config;
};

window.UI.PlaybackDetailsViewController.prototype =
{
    _resizeProgressBar: function(size)
    {
        this.view.find(this.config.PlaybackProgressBarContainer).css("height", size);
        this.view.find(this.config.PlaybackProgressBar).css("height", size);
    },

    _resizeDataBar: function(size)
    {
        this.view.find(this.config.PlaybackDataBarContainer).css("height", size);
        this.view.find(this.config.PlaybackDataBar).css("height", size);
    },

    _handleMouseEnter: function(that)
    {
        var mouseEnterHandler = function()
        {
            that.view.css("height", that.config.MouseOverProgressBarSize);
            that.view.find(that.config.PlaybackDetailsContainer).css("height", that.config.MouseOverProgressBarSize);

            that._resizeProgressBar(that.config.MouseOverProgressBarSize);
            that._resizeDataBar(that.config.MouseOverDataBarSize);

            that.view.find(that.config.PlaybackTime).show();
        };
        return mouseEnterHandler;
    },

    _handleMouseLeave: function(that)
    {
        var mouseLeaveHandler = function()
        {
            that.view.css("height", that.config.MouseOutProgressBarSize);
            that.view.find(that.config.PlaybackDetailsContainer).css("height", that.config.MouseOutProgressBarSize);

            that._resizeProgressBar(that.config.MouseOutProgressBarSize);
            that._resizeDataBar(that.config.MouseOutDataBarSize);

            that.view.find(that.config.PlaybackTime).hide();
        };
        return mouseLeaveHandler;
    },

    _handleDetailsUpdateRequest: function()
    {
        var title = this.model.getMediaDetails().artist + " - " + this.model.getMediaDetails().title;
        var time = this.model.getPlaybackTime() + "/" + this.model.getDuration();

        this._updateView(this.model.getPlaybackState(), title, time);
        this._updatePageTitle(this.model.getPlaybackState(), title, time);
        this._updatePlaybackProgress();
        this._updateDataProgress();
    },

    _updatePlaybackProgress: function()
    {
        this.view.find(this.config.PlaybackProgressBar).css("width", this.model.getPlaybackProgress()+"%");
    },

    _updateDataProgress: function()
    {
        this.view.find(this.config.PlaybackDataBar).css("width", this.model.getDataProgress()+"%");
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

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.Events.PlaybackDetailsUpdated, this._handleDetailsUpdateRequest, null, this);
        //bind to mouse events
        var mouseEnterHandler = this._handleMouseEnter(this);
        var mouseLeaveHandler = this._handleMouseLeave(this);

        this.view.mouseenter(mouseEnterHandler);
        this.view.mouseleave(mouseLeaveHandler);
    }
};