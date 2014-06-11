//namespace
window.UI = window.UI || {};

window.UI.ProgressbarControl = function(title)
{
    this.container = $("#controls-schemes .progressbar").clone();
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