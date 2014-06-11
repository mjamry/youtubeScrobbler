//namespace
window.UI = window.UI || {};

window.UI.ProgressbarControl = function(containerClass, title)
{
    this.containerClass = containerClass;
};

window.UI.ProgressbarControl.prototype =
{
    update: function(value)
    {
        this.container.width(value+"%");
    },

    hide: function()
    {
        this.container.hide();
    }
};