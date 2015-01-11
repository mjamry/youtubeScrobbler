//namespace
window.UI = window.UI || {};

window.UI.ScrobblingControlViewController = function(view, scrobbler, config)
{
    this.scrobbler = scrobbler;
    this.config = config;
    this.view = view;
};

window.UI.ScrobblingControlViewController.prototype =
{
    _changeScrobblingState: function(that)
    {
        return function()
        {
            var isScrobblingEnabled = that.scrobbler.toggleScrobblingMode();

            if(isScrobblingEnabled)
            {
                that.view.find(that.config.ScrobblingButton).addClass(that.config.SelectedButtonClass);
                UserNotifier.getInstance().info("Scrobbling has been enabled.");
            }
            else
            {
                that.view.find(that.config.ScrobblingButton).removeClass(that.config.SelectedButtonClass);
                UserNotifier.getInstance().info("Scrobbling has been disabled.");
            }
        };
    },

    _disableButtons: function()
    {
        this.view.find(this.config.PlaylistControlButtonClass).attr(this.config.DisabledAttr, true);
    },

    _enableButtons: function()
    {
        this.view.find(this.config.PlaylistControlButtonClass).removeAttr(this.config.DisabledAttr);
    },

    initialise: function()
    {
        //bind to Ui events
        this.view.find(this.config.ScrobblingButton).click(this._changeScrobblingState(this));

        EventBroker.getInstance().addListener(window.UI.Events.EnableControlButtonsRequested, $.proxy(this._enableButtons, this));
        EventBroker.getInstance().addListener(window.UI.Events.DisableControlButtonsRequested, $.proxy(this._disableButtons, this));

        this._disableButtons();
    }
};
