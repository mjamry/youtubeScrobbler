//namespace
window.UI = window.UI || {};

window.UI.TestReportsViewController = function(config)
{
    this._config = config;
    this._errorContainer = $(config.ErrorFormContainer);
    this._featureContainer = $(config.FeatureFormContainer);
};

window.UI.TestReportsViewController.prototype =
{
    _hookUpToButtonsEvents: function()
    {
        var errorBtn = $(this._config.ErrorButton);
        errorBtn.click($.proxy(function()
        {
            if(this._errorContainer.is(':visible'))
            {
                this._errorContainer.hide();
            }
            else
            {
                this._errorContainer.show();
            }
        },
        this));

        var featureBtn = $(this._config.FeatureButton);
        featureBtn.click($.proxy(function()
        {
            if(this._featureContainer.is(':visible'))
            {
                this._featureContainer.hide();
            }
            else
            {
                this._featureContainer.show();
            }
        },
        this));
    },

    _hookUpFormsActions: function()
    {
        this._errorContainer.submit($.proxy(function(e)
        {
            e.preventDefault();
            this._handleErrorReport();
        },
        this));

        this._featureContainer.submit($.proxy(function(e)
        {
            e.preventDefault();
            this._handleFeatureRequest();
        },
        this));
    },

    _handleErrorReport: function()
    {
        var title = $(this._config.ErrorTitle).val();
        var description = $(this._config.ErrorDescription).val();
        var email = $(this._config.ErrorEmail).val();

        if(title && description && email)
        {
            var callbacks =
            {
                success: function()
                {
                    Logger.getInstance().info("Bug report has been sent.");
                    Logger.getInstance().debug("Bug title: "+title);
                    alert("Success.\r\n\rBug report has been sent.\r\nThank you for your effort.\r\n\r\nWe will stay in touch.");
                },
                fail: function()
                {
                    Logger.getInstance().info("Error occurs while sending error report.");
                    alert("Failure.\r\n\r\nSorry cannot send your error report.\r\n\r\nPleas try again.");
                }
            };
            ReportSender.getInstance().sendErrorReport(email, title, description, callbacks);
            this._errorContainer.hide();
        }
    },

    _handleFeatureRequest: function()
    {
        var title = $(this._config.FeatureTitle).val();
        var description = $(this._config.FeatureDescription).val();
        var email = $(this._config.FeatureEmail).val();

        if(title && description && email)
        {
            var callbacks =
            {
                success: function()
                {
                    Logger.getInstance().info("Feature request has been sent.");
                    alert("Success.\r\n\r\nFeature request has been sent.\r\nThank you for your effort.\r\n\r\nWe will stay in touch.");
                },
                fail: function()
                {
                    Logger.getInstance().info("Error occurs while sending feature request.");
                    alert("Failure.\r\n\r\nSorry cannot send your feature request.\r\n\r\nPleas try again.");
                }
            };
            ReportSender.getInstance().sendFeatureRequest(email, title, description, callbacks);
            this._featureContainer.hide();
        }
    },

    initialise: function()
    {
        this._errorContainer.hide();
        this._featureContainer.hide();

        this._hookUpToButtonsEvents();

        this._hookUpFormsActions();
    }
};