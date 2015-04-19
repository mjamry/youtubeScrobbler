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
    //{content, fullscreen, canClose}
    //where content can be a html code, and source name of DOM element
    show: function(data)
    {
        //determines if modal shoudl be set to fullscreen (overlay opacity = 1) or not
        data.fullscreen = data.fullscreen || false;
        //determines if it is possible to close modal by clicking outside
        data.canClose = data.canClose || false;

        this.modalId++;
        $.extend(data, {id: this.modalId});
        this.viewController.show(data);
        return this.modalId;
    },

    close: function(id)
    {
        this.viewController.close(id);
    }
};