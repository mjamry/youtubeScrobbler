//using
window.UI = window.UI || {};

window.UI.PlaybackDetailsViewController = function(model, view)
{
    this.view = $("#"+view);
    this.model = model;
};

window.UI.PlaybackDetailsViewController.prototype =
{
    _handleDetailsUpdateRequest: function()
    {
        //TODO do it in more appropriate way
        if(this.model.getPlaybackState() != "Stoped")
        {
            var title = this.model.getMediaDetails().artist + " - " + this.model.getMediaDetails().title;
            var time = this.model.getPlaybackTime() + "/" + this.model.getDuration();

            this._updateView(this.model.getPlaybackState(), title, time);
            this._updatePageTitle(this.model.getPlaybackState(), title, time);
        }
        else
        {
            this._updateView("Stoped", "", "");
            this._updatePageTitle("", "Online Scrobbler", "");
        }
    },

    _updateView: function(state, title, time)
    {
        this.view.html(state+": "+title+" ["+time+"]");
    },

    _updatePageTitle: function(state, title, time)
    {
        document.title = title+"|"+time;
    },

    initialise: function()
    {
        window.Common.EventBrokerSingleton.instance().addListener(window.Player.Events.PlaybackDetailsUpdateRequested, this._handleDetailsUpdateRequest, null, this);
    }
};