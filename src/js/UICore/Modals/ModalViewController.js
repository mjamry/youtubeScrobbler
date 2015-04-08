window.UI = window.UI || {};

window.UI.ModalViewController = function(view)
{
    this.view = view;
};

window.UI.ModalViewController.prototype =
{
    _displayModalWithContent: function(content)
    {

    },

    _displayModalUsingSource: function(source)
    {

    },

    _onModalRequested: function(data)
    {
        if(data.content)
        {
            this._displayModalWithContent(data.content);
        }

        if(data.source)
        {
            this._displayModalUsingSource(data.source);
        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.ModalEvents.ModalDisplayRequested, this._onModalRequested.bind(this));
    }
};