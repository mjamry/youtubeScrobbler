//namespace
window.UI = window.UI || {};

window.UI.PlaylistControlViewController = function(playlistService, playlistController, view, config)
{
    this.playlistController = playlistController;
    this.playlistService = playlistService;
    this.config = config;
    this.view = view;
};

window.UI.PlaylistControlViewController.prototype =
{
    _clearPlaylist: function(model)
    {
        return function()
        {
            model.clearPlaylist();
        };
    },

    _savePlaylist: function(model)
    {
        return function()
        {
            model.savePlaylist();
        };
    },

    _changeLoopModeState: function(that)
    {
        return function()
        {
            var isLoopModeOn = that.playlistController.toggleLoopMode();

            if(isLoopModeOn)
            {
                that.view.find(that.config.LoopButton).addClass(that.config.SelectedButtonClass);
                UserNotifier.getInstance().info("Playlist loop mode on.");
            }
            else
            {
                that.view.find(that.config.LoopButton).removeClass(that.config.SelectedButtonClass);
                UserNotifier.getInstance().info("Playlist loop mode off.");
            }
        };
    },

    _shufflePlaylist: function(model)
    {
        return function()
        {
            model.shuffle();
            UserNotifier.getInstance().info("Playlist has been shuffled.");
        };
    },

    _disableButtons: function()
    {
        this.view.find(this.config.PlaylistControlButtonClass).attr(this.config.DisabledAttr, true);
    },

    _enableButtons: function()
    {
        this.view.find(this.config.PlaylistControlButtonClass).removeAttr(this.config.DisabledAttr);
    },

    initialise: function()
    {
        //bind to Ui events
        this.view.find(this.config.ClearButton).click(this._clearPlaylist(this.playlistService));
        this.view.find(this.config.SaveButton).click(this._savePlaylist(this.playlistService));
        this.view.find(this.config.ShuffleButton).click(this._shufflePlaylist(this.playlistController));
        this.view.find(this.config.LoopButton).click(this._changeLoopModeState(this));

        EventBroker.getInstance().addListener(window.UI.Events.EnableControlButtonsRequested, $.proxy(this._enableButtons, this));
        EventBroker.getInstance().addListener(window.UI.Events.DisableControlButtonsRequested, $.proxy(this._disableButtons, this));

        this._disableButtons();
    }
};
