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
    _clearPlaylist: function(model)
    {
        return function()
        {
            model.clearPlaylist();
        }
    },

    _savePlaylist: function(model)
    {
        return function()
        {
            //model.save();
        }
    },

    _changeRepeatState: function(that)
    {
        return function()
        {
            var currentState = that.model.getPlaylistLoop();
            if(currentState)
            {
                that.view.find(that.config.RepeatButton).addClass(that.config.SelectedButtonClass);
            }
            else
            {
                that.view.find(that.config.RepeatButton).removeClass(that.config.SelectedButtonClass);
            }

            that.model.setPlaylistLoop(!currentState);
        }
    },

    _shufflePlaylist: function(model)
    {
        return function()
        {
            model.shuffle();
        }
    },

    initialise: function()
    {
        //bind to Ui events
        this.view.find(this.config.ClearButton).click(this._clearPlaylist(this.model));
        this.view.find(this.config.SaveButton).click(this._savePlaylist(this.model));
        this.view.find(this.config.ShuffleButton).click(this._shufflePlaylist(this.model));
        this.view.find(this.config.RepeatButton).click(this._changeRepeatState(this));
    }
};
