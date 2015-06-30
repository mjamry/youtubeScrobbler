window.UI = window.UI || {};

window.UI.ChangelogViewController = function()
{

};

window.UI.ChangelogViewController.prototype =
{
    initialise: function()
    {

    },

    show: function(data)
    {
        var changelog = $("#control-schemes .changelog");
        changelog.find(this.config.DataContainer).append(data);

        var modalId = ModalService.getInstance().show({content: changelog});

        var closeChangelog = function(modalId)
        {
            return function()
            {
                ModalService.getInstance().close(modalId);
            }
        };

        changelog.find(this.config.CloseButton).click(closeChangelog(modalId));
    }
};