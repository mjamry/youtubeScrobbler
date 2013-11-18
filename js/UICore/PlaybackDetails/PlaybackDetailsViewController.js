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
        this.view.find(this.config.PlaybackProgress).css("width", this.model.getPlaybackProgress()+"%");
    },

    _updateDataProgress: function()
    {
        this.view.find(this.config.PlaybackData).css("width", this.model.getDataProgress()+"%");
    },

    _updateView: function(state, title, time)
    {
        this.view.find(this.config.PlaybackDetailsContainer).html(state+": "+title+" ["+time+"]");
    },

    _updatePageTitle: function(state, title, time)
    {
        document.title = title+"|"+time;
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.Events.PlaybackDetailsUpdateRequested, this._handleDetailsUpdateRequest, null, this);
    }
};