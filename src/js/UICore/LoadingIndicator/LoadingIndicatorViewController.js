window.UI = window.UI || {};

window.UI.LoadingIndicatorViewController = function(config)
{
    this.view = config.IndicatorContainer;
};

window.UI.LoadingIndicatorViewController.prototype =
{
    _show: function(that)
    {
        return function onIndicatorShown(title, fullScreen)
        {
            var opacity = that.config.NonFullScreenOpacity;
            if(fullScreen)
            {
                that.view.find(that.config.IndicatorOverlay).css("opacity", that.config.FullScreenOpacity);
            }

            that.view.find(that.config.IndicatorOverlay).css("opacity", opacity);

            that.view.show();
        };

    },

    _hide: function(that)
    {
        return function onIndicatorHidden()
        {
            that.view.hide();
        };
    },

    _update: function(that)
    {
        return function onIndicatorContentUpdated(newContent)
        {
            that.view.find(that.config.IndicatorDescription).html(newContent);
        };
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorServiceEvents.ShowIndicator, this._show(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorServiceEvents.HideIndicator, this._hide(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorServiceEvents.UpdateContent, this._update(this));
    }
};