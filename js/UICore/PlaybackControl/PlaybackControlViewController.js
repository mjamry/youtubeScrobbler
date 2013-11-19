//namespace
window.UI = window.UI || {};

window.UI.PlaybackControlViewController = function(model, view, config)
{
    this.view = $("#"+view);
    this.model = model;
    this.config = config;
};

//TODO add volume control.
window.UI.PlaybackControlViewController.prototype =
{
    _play: function(model)
    {
        return function ()
        {
            model.play();
        };
    },

    _pause: function(model)
    {
        return function ()
        {
            model.pause();
        };
    },

    _next: function(model)
    {
        return function ()
        {
            model.next();
        };
    },

    _previous: function(model)
    {
        return function ()
        {
            model.previous();
        };
    },

    initialise: function()
    {
        //bind to ui events
        this.view.find(this.config.PlayButton).click(this._play(this.model));
        this.view.find(this.config.PauseButton).click(this._pause(this.model));
        this.view.find(this.config.NextButton).click(this._next(this.model));
        this.view.find(this.config.PreviousButton).click(this._previous(this.model));
    }
};