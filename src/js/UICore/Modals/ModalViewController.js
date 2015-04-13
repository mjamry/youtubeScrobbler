window.UI = window.UI || {};

window.UI.ModalViewController = function(view, config)
{
    this.view = view;
    this.config = config;
};

window.UI.ModalViewController.prototype =
{
    _close: function(id)
    {
        $("#"+this.config.ModalIdClassName+id).remove();
    },

    _displayModalWithContent: function(content, id)
    {
        var newModal = $("#controls-schemes .modal-content-container").clone();
        newModal.attr("id", this.config.ModalIdClassName+id);

        //close modal when user click outside of main form/control
        newModal.find(this.config.ModalOverlay).click(function()
        {
            this._close(id);
        }.bind(this));

        newModal.find(this.config.ModalContent).append(content);
        $(this.config.ModalsContainer).append(newModal);
    },

    _onModalShowRequested: function(data)
    {
        this._displayModalWithContent(data.content, data.id);
    },

    _onModalCloseRequested: function(data)
    {
        this._close(data.id);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.ModalEvents.ModalDisplayRequested, this._onModalShowRequested.bind(this));
        EventBroker.getInstance().addListener(window.Services.ModalEvents.ModalCloseRequested, this._onModalCloseRequested.bind(this));


    }
};