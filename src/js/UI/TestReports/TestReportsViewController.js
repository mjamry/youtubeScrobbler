//namespace
window.UI = window.UI || {};

window.UI.TestReportsViewController = function(reportSender, config)
{
    this._reportSender = reportSender || new window.UI.ReportSender();
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
                    Logger.getInstance().Info("Bug report has been sent.");
                    Logger.getInstance().Debug("Bug title: "+title);
                    alert("Success.\r\n\r\Bug report has been sent.\r\nThank you for your effort.\r\n\r\nWe will stay in touch.")
                },
                fail: function()
                {
                    Logger.getInstance().Info("Error occurs while sending error report.");
                    alert("Failure.\r\n\r\nSorry cannot send your error report.\r\n\r\nPleas try again.");
                }
            };
            this._reportSender.sendErrorReport(email, title, description, callbacks);
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
                    Logger.getInstance().Info("Feature request has been sent.");
                    alert("Success.\r\n\r\nFeature request has been sent.\r\nThank you for your effort.\r\n\r\nWe will stay in touch.")
                },
                fail: function()
                {
                    Logger.getInstance().Info("Error occurs while sending feature request.");
                    alert("Failure.\r\n\r\nSorry cannot send your feature request.\r\n\r\nPleas try again.");
                }
            };
            this._reportSender.sendFeatureRequest(email, title, description, callbacks);
            this._featureContainer.hide();
        }
    },

    _showForm: function(config)
    {
        return function()
        {
            $(config.TestingFormContainer).show();
        }
    },

    _hideForm: function(config)
    {
        return function()
        {
            $(config.TestingFormContainer).hide();
        }
    },

    initialise: function()
    {
        this._errorContainer.hide();
        this._featureContainer.hide();

        this._hookUpToButtonsEvents();

        this._hookUpFormsActions();

        $(this._config.ShowFormButton).click(this._showForm(this._config));
        $(this._config.HideFormButton).click(this._hideForm(this._config));

        this._hideForm(this._config)();
    }
};