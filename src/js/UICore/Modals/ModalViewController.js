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

    show: function(data)
    {
        var newModal = $("#controls-schemes .modal-content-container").clone();
        newModal.attr("id", this.config.ModalIdClassName + data.id);

        if (data.canClose)
        {
        //close modal when user click outside of main form/control
            newModal.find(this.config.ModalOverlay).click(function ()
            {
                this._close(data.id);
            }.bind(this));
        }

        if(data.fullscreen)
        {
            newModal.find(this.config.ModalOverlay).css("opacity", 1);
            newModal.find(this.config.ModalContent).css("border", "none");
        }

        newModal.find(this.config.ModalContent).append(data.content);
        $(this.config.ModalsContainer).append(newModal);
    },

    close: function(id)
    {
        this._close(id);
    }
};