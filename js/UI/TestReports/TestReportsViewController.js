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
            this._errorContainer.show();
        },
        this));

        var featureBtn = $("#"+this._config.featureButton);
        featureBtn.click($.proxy(function()
        {
            this._featureContainer.show();
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
                    window.Common.Log.Instance().Info("Error report has been sent.");
                    window.Common.Log.Instance().Debug("Error title: "+title);
                    alert("Success.\r\n\r\nError report has been sent.\r\nThank you for your effort.\r\n\r\nWe will stay in touch.")
                },
                fail: function()
                {
                    window.Common.Log.Instance().Info("Error occurs while sending error report.");
                    alert("Failure.\r\n\r\nSorry cannot send your error report.\r\n\r\nPleas try again.");
                }
            };
            this._reportSender.send(email, title, description, callbacks);
            this._errorContainer.hide();
        }
    },

    initialise: function()
    {
        this._errorContainer.hide();

        this._hookUpToButtonsEvents();

        this._hookUpFormsActions();
    }
};