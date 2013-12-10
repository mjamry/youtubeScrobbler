//namespace
window.UI = window.UI || {};

window.UI.TestReportsViewController = function(reportSender, config)
{
    this._reportSender = reportSender || new window.UI.ReportSender();
    this._config = config;
    this._errorContainer = $("#"+config.errorFormContainer);
    this._featureContainer = $("#"+config.featureFormContainer);
};

window.UI.TestReportsViewController.prototype =
{
    _hookUpToButtonsEvents: function()
    {
        var errorBtn = $("#"+this._config.errorButton);
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

        var featureBtn = $("#"+this._config.featureButton);
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
    },

    _handleErrorReport: function()
    {
        var title = document.getElementById(this._config.error_title).value;
        var description = document.getElementById(this._config.error_description).value;
        var email = document.getElementById(this._config.error_email).value;

        if(title && description && email)
        {
            var callbacks =
            {
                success: function()
                {
                    Logger.getInstance().Info("Error report has been sent.");
                    Logger.getInstance().Debug("Error title: "+title);
                    alert("Success.\r\n\r\nError report has been sent.\r\nThank you for your effort.\r\n\r\nWe will stay in touch.")
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

    _showForm: function(config)
    {
        return function()
        {
            $(config.testingFormContainer).show();
        }
    },

    _hideForm: function(config)
    {
        return function()
        {
            $(config.testingFormContainer).hide();
        }
    },

    initialise: function()
    {
        this._errorContainer.hide();

        this._hookUpToButtonsEvents();

        this._hookUpFormsActions();

        $(this._config.showFormButton).click(this._showForm(this._config));
        $(this._config.hideFormButton).click(this._hideForm(this._config));

        this._hideForm(this._config)();
    }
};