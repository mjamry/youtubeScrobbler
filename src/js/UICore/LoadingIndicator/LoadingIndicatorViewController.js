window.UI = window.UI || {};

window.UI.LoadingIndicatorViewController = function(config)
{
    this.config = config;
    this.modalId;
};

window.UI.LoadingIndicatorViewController.prototype =
{
    //{title, fullScreen}
    _show: function(data)
    {
        var view = $("#controls-schemes .loading-indicator").clone();
        view.find(this.config.IndicatorTitle).html(data.title);
        this.modalId = ModalService.getInstance().show({content: view});
    },

    _hide: function()
    {
       // ModalService.getInstance().close(this.modalId);
    },

    _update: function(data)
    {
        //ModalService.getInstance().close(this.modalId);
        this._show(data.content);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.ShowIndicator, this._show.bind(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.HideIndicator, this._hide.bind(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.UpdateContent, this._update.bind(this));
    }
};