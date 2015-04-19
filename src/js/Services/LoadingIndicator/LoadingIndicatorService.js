window.Services = window.Services || {};

LoadingIndicatorService = function()
{
    LoadingIndicatorService._instance = null;
};

LoadingIndicatorService.setInstance = function(instance)
{
    if(LoadingIndicatorService._instance !== null)
    {
        var errorMsg = "Instance of LoadingIndicatorService has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    LoadingIndicatorService._instance = instance;
};

LoadingIndicatorService.getInstance = function()
{
    if(LoadingIndicatorService._instance === null)
    {
        var errorMsg = "Instance of LoadingIndicatorService has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return LoadingIndicatorService._instance;
};


window.Services.LoadingIndicatorServiceImpl = function(config)
{
    this.config = config;
};

window.Services.LoadingIndicatorServiceImpl.prototype =
{
    show: function(details)
    {
        //in case if already displayed
        this.hide();

        var content = $("#controls-schemes .loading-indicator").clone();
        content.find(this.config.IndicatorTitle).html(details.title);
        content.find(this.config.IndicatorDescription).html(details.description);

        this.modalId = ModalService.getInstance().show({
            content: content,
            fullscreen: details.fullscreen,
            canClose: details.canClose
        });
    },

    hide: function()
    {
        ModalService.getInstance().close(this.modalId);
    }
};