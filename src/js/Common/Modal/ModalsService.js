window.Services = window.Services || {};

ModalsService = function()
{
    ModalsService._instance = null;
};

ModalsService.setInstance = function(instance)
{
    if(ModalsService._instance !== null)
    {
        var errorMsg = "Instance of ModalsService has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    ModalsService._instance = instance;
};

ModalsService.getInstance = function()
{
    if(ModalsService._instance === null)
    {
        var errorMsg = "Instance of ModalsService has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return ModalsService._instance;
};

window.Services.ModalsServiceImpl = function(){};

window.Services.ModalsServiceImpl.protorype =
{
    //data:
    //{ content, source }
    //where content can be a html code, and source name of DOM element
    show: function(data)
    {
        EventBroker.getInstance().fireEventWithData(window.Services.ModalEvents.ModalDisplayRequested, data);
    }
};