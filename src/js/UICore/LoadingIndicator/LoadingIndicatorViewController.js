window.UI = window.UI || {};

window.UI.LoadingIndicatorViewController = function(config)
{
    this.view = $(config.IndicatorContainer);
    this.config = config;
};

window.UI.LoadingIndicatorViewController.prototype =
{
    //{title, fullScreen}
    _show: function(data)
    {
        this._hide();
        var opacity = this.config.NonFullScreenOpacity;
        if(data.fullScreen)
        {
            opacity = this.config.FullScreenOpacity;
        }

        this.view.find(this.config.IndicatorOverlay).css("opacity", opacity);

        this.view.find(this.config.IndicatorTitle).html(data.title);
        this.view.show();
    },

    _hide: function()
    {
        this.view.hide();
        this.view.find(this.config.IndicatorTitle).html("");
        this.view.find(this.config.IndicatorDescription).html("");
    },

    _update: function(data)
    {
        this.view.find(this.config.IndicatorDescription).html(data.content);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.ShowIndicator, this._show.bind(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.HideIndicator, this._hide.bind(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.UpdateContent, this._update.bind(this));
    }
};