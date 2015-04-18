window.UI = window.UI || {};

window.UI.LoadingIndicatorViewController = function(config)
{
    this.config = config;
};

window.UI.LoadingIndicatorViewController.prototype =
{
    //{title, fullScreen}
    _show: function(data)
    {
        //in case if already displayed
        this._hide();
        var newModal = $("#controls-schemes .modal-content-container").clone();
        newModal.attr("id", "loader");

        var content = $("#controls-schemes .loading-indicator").clone();
        content.find(this.config.IndicatorTitle).html(data.title);
        content.find(this.config.IndicatorDescription).html(data.content);

        newModal.find(this.config.ModalContent).append(content);
        $(this.config.ModalsContainer).append(newModal);
    },

    _hide: function()
    {
        $("#loader").remove();
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.ShowIndicator, this._show.bind(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.HideIndicator, this._hide.bind(this));
        EventBroker.getInstance().addListener(window.Services.LoadingIndicatorEvents.UpdateContent, this._update.bind(this));
    }
};