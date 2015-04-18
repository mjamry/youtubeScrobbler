window.Services = window.Services || {};

ModalService = function()
{
    ModalService._instance = null;
};

ModalService.setInstance = function(instance)
{
    if(ModalService._instance !== null)
    {
        var errorMsg = "Instance of ModalService has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    ModalService._instance = instance;
};

ModalService.getInstance = function()
{
    if(ModalService._instance === null)
    {
        var errorMsg = "Instance of ModalService has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return ModalService._instance;
};

window.Services.ModalServiceImpl = function(viewController)
{
    this.modalId = 0;
    this.viewController = viewController;
};

window.Services.ModalServiceImpl.prototype =
{
    //data:
    //{ content, id }
    //where content can be a html code, and source name of DOM element
    show: function(data)
    {
        this.modalId++;
        this.viewController.show(data.content, this.modalId);
        return this.modalId;
    },

    close: function(id)
    {
        this.viewController.close(id);
    }
};