//namespace
window.UI = window.UI || {};

window.UI.ProgressbarViewController = function()
{
    //substitute for dictionary
    this.ids = new Object();
};

window.UI.ProgressbarViewController.prototype =
{
    _createNewProgressbar: function()
    {

    },

    _handleProgressbarRegistration: function(id)
    {
        this.ids[id] = this._createNewProgressbar();
    },

    _handleProgressbarStatusUpdate: function(args)
    {
        var progressbar = this.ids[args.id];
        progressbar.update(args.value);
        if(args.value = 100)
        {
            //hide and remove progressbar
            //progressbar.hide();

        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.UI.ProgressbarServiceEvents.RegisterNewProgressbar, this._handleProgressbarRegistration);
        EventBroker.getInstance().addListener(window.UI.ProgressbarServiceEvents.UpdateProgressbarStatus, this._handleProgressbarStatusUpdate);
    }
};