window.UI = window.UI || {};

window.UI.LoadingIndicatorViewController = function(config)
{
    this.config = config;
    this.modalId;
};

window.UI.LoadingIndicatorViewController.prototype =
{
    //{title, content, fullScreen}
    show: function(data)
    {
        //in case if already displayed
        this.hide();

        var content = $("#controls-schemes .loading-indicator").clone();
        content.find(this.config.IndicatorTitle).html(data.title);
        content.find(this.config.IndicatorDescription).html(data.content);

        this.modalId = ModalService.getInstance().show({content: content});
    },

    hide: function()
    {
        ModalService.getInstance().close(this.modalId);
    }
};