//namespace
window.UI = window.UI || {};

window.UI.ProgressbarControl = function(controlClass, title)
{
    this.container = $("#controls-schemes .progressbar").clone();
    this.container.find(".progressbar-title").text(title);
};

window.UI.ProgressbarControl.prototype =
{
    update: function(value)
    {
        this.container.find(".progressbar-body").width(value+"%");
    },

    hide: function()
    {
        this.container.hide();
    }
};