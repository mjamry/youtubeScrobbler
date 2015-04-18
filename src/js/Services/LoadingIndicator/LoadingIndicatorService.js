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


window.Services.LoadingIndicatorServiceImpl = function(viewController)
{
    this.viewCtrl = viewController;
};

window.Services.LoadingIndicatorServiceImpl.prototype =
{
    show: function(title, fullScreen)
    {
       // fullScreen = fullScreen || false;
        this.viewCtrl._show({title: title});
        //EventBroker.getInstance().fireEventWithData(window.Services.LoadingIndicatorEvents.ShowIndicator, {title: title, fullScreen: fullScreen});
    },

    hide: function()
    {
        this.viewCtrl._hide();
    },

    updateContent: function(newContent)
    {
        this.viewCtrl._update({content: newContent});
    }
};