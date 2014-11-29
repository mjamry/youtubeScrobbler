window.UI = window.UI || {};

window.UI.AppDetailsViewController = function(config)
{
    this.config = config;
};

window.UI.AppDetailsViewController.prototype =
{
    setupDetails: function(details)
    {
        $(this.config.AppNameContainer).html(details.Name);
        $(this.config.AppVersionContainer).html(details.Version);
    }
};
