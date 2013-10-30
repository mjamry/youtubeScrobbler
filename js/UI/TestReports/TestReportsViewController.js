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

        this._reportSender.send(email, title, description);

        this._errorContainer.hide();
    },

    initialise: function()
    {
        this._errorContainer.hide();

        this._hookUpToButtonsEvents();

        this._hookUpFormsActions();
    }
}