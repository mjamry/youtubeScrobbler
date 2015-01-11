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


window.Services.LoadingIndicatorServiceImpl = function(){};

window.Services.LoadingIndicatorServiceImpl.prototype =
{
    show: function(title, fullScreen)
    {
        fullScreen = fullScreen || false;
        EventBroker.getInstance().fireEventWithData(window.Services.LoadingIndicatorEvents.ShowIndicator, {title: title, fullScreen: fullScreen});
    },

    hide: function()
    {
        EventBroker.getInstance().fireEvent(window.Services.LoadingIndicatorEvents.HideIndicator);
    },

    updateContent: function(newContent)
    {
        EventBroker.getInstance().fireEventWithData(window.Services.LoadingIndicatorEvents.UpdateContent, {content: newContent});
    }
};