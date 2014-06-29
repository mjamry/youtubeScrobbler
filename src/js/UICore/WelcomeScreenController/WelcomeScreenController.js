window.UI = window.UI || {};

window.UI.WelcomeScreenController = function(config, view, model)
{
    this.config = config;
    this.view = view;
    this.model = model;
};

window.UI.WelcomeScreenController.prototype =
{
    showWelcomeScreen: function()
    {
        this.view.find(this.config.WelcomeScreenId).show();
        this.view.find(this.config.MainScreenId).hide();
    },

    showMainScreen: function()
    {
        this.view.find(this.config.MainScreenId).show();
        this.view.find(this.config.WelcomeScreenId).hide();
    }
};