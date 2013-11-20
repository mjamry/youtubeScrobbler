//namespace
window.UI = window.UI || {};

window.UI.PlaylistControlViewController = function(model, view, config)
{
    this.model = model;
    this.config = config;
    this.view = $("#"+view);
};

window.UI.PlaylistControlViewController.prototype =
{
    _clear: function(model)
    {
        return function()
        {
            //model.createPlaylist(new window.Player.Playlist());
        }
    },

    _save: function(model)
    {
        return function()
        {
            //model.save();
        }
    },

    _changeRepeatState: function(model)
    {
        return function()
        {
            //model.repeat...
        }
    },

    _changeShuffleState: function(model)
    {
        return function()
        {
            //model.shuffle...
        }
    },

    initialise: function()
    {
        //bind to Ui events
        this.view.find(this.config.ClearButton).click(this._clear(this.model));
        this.view.find(this.config.SaveButton).click(this._save(this.model));
        this.view.find(this.config.ShuffleButton).click(this._changeShuffleState(this.model));
        this.view.find(this.config.RepeatButton).click(this._changeRepeatState(this.model));
    }
};
