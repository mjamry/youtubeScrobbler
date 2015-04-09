window.UI = window.UI || {};

window.UI.ModalViewController = function(view, config)
{
    this.view = view;
    this.config = config;
};

window.UI.ModalViewController.prototype =
{
    _displayModalWithContent: function(content, id)
    {
        var newModal = $("#controls-schemes .modal-content-container").clone();
        newModal.addClass(this.config.ModalIdClassName+id);

        var cont = newModal.find(this.config.ModalContent);
        cont.append(content);
        $(this.config.ModalsContainer).append(newModal);
        newModal.show();
        this.view.show();
    },

    _displayModalUsingSource: function(source, id)
    {

    },

    _onModalRequested: function(data)
    {
        if(data.content)
        {
            this._displayModalWithContent(data.content, data.id);
        }

        if(data.source)
        {
            this._displayModalUsingSource(data.source, data.id);
        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.ModalEvents.ModalDisplayRequested, this._onModalRequested.bind(this));
    }
};