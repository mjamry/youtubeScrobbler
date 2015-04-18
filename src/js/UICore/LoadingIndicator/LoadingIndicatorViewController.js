window.UI = window.UI || {};

window.UI.LoadingIndicatorViewController = function(config)
{
    this.config = config;
};

window.UI.LoadingIndicatorViewController.prototype =
{
    //{title, content, fullScreen}
    show: function(data)
    {
        //in case if already displayed
        this.hide();
        var newModal = $("#controls-schemes .modal-content-container").clone();
        newModal.attr("id", this.config.IndicatorId);

        var content = $("#controls-schemes .loading-indicator").clone();
        content.find(this.config.IndicatorTitle).html(data.title);
        content.find(this.config.IndicatorDescription).html(data.content);

        newModal.find(this.config.ModalContent).append(content);
        $(this.config.ModalsContainer).append(newModal);
    },

    hide: function()
    {
        $("#"+this.config.IndicatorId).remove();
    }
};