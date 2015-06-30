window.UI = window.UI || {};

window.UI.ChangelogViewController = function(config)
{
    this.config = config;
};

window.UI.ChangelogViewController.prototype =
{
    _handleDataObtained:function(data)
    {
        this.show(data);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Services.ChangelogEvents.ChangelogDataReceived, this._handleDataObtained.bind(this));
    },

    show: function(data)
    {
        var changelog = $("#controls-schemes .changelog").clone();
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