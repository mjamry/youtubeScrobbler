window.UI = window.UI || {};

window.UI.LoadingIndicatorViewController = function(config)
{
    this.view = config.IndicatorContainer;
};

window.UI.LoadingIndicatorViewController.prototype =
{
    _show: function(that)
    {
        //eventArgs: {title, fullScreen}
        return function onIndicatorShown(eventArgs)
        {
            var opacity = that.config.NonFullScreenOpacity;
            if(eventArgs.fullScreen)
            {
                that.view.find(that.config.IndicatorOverlay).css("opacity", that.config.FullScreenOpacity);
            }

            that.view.find(that.config.IndicatorOverlay).css("opacity", opacity);

            that.view.find(that.config.IndicatorTitle).html(eventArgs.title);
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
        //eventArgs: {content}
        return function onIndicatorContentUpdated(eventArgs)
        {
            that.view.find(that.config.IndicatorDescription).html(eventArgs.content);
        };
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.ShowIndicator, this._show(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.HideIndicator, this._hide(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.UpdateContent, this._update(this));
    }
};