//namespace
window.UI = window.UI || {};

window.UI.ProgressbarControl = function(controlClass, title)
{
    this.container = $("#controls-schemes .progressbar").clone();
    this.container.find(".progressbar-title").text(title);

    this.timer = 0;
    this._setTimeout();
};

window.UI.ProgressbarControl.prototype =
{
    _setTimeout: function()
    {
        this.timer = setTimeout(this.hide.bind(this), window.UI.ProgressbarControlConfiguration.Timeout);
    },

    _refreshTimeout: function()
    {
        clearTimeout(this.timer);
        this._setTimeout();
    },

    update: function(value)
    {
        this.container.find(window.UI.ProgressbarControlConfiguration.ProgressbarBody).width(value+"%");
        this._refreshTimeout();
    },

    hide: function()
    {
        this.container.hide();
        clearTimeout(this.timer);
    }
};