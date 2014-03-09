//namespace
window.UI = window.UI || {};

window.UI.PlaylistControlViewController = function(playlistService, playlistController, loveStateModifier, view, config)
{
    this.playlistController = playlistController;
    this.playlistService = playlistService;
    this.loveStateModifier = loveStateModifier;
    this.config = config;
    this.view = $("#"+view);
};

window.UI.PlaylistControlViewController.prototype =
{
    //changes love state for currently played track
    _changeLoveStateForCurrentTrack: function(that)
    {
        return function changeLoveStateForCurrentTrack()
        {
            that.loveStateModifier.toggleTrackLoveState(that._handleLoveStateChanged(that));
        };
    },

    //handles successful change of love state
    _handleLoveStateChanged: function(that)
    {
        return function _handleLoveStateChanged(index, mediaDetails)
        {
            that._setLoveStateForCurrentTrack(mediaDetails.loved);
            that.playlistService.updateItem(index, mediaDetails);
        };
    },

    //handles change of currently played track
    _handleMediaChanged: function(args)
    {
        this._setLoveStateForCurrentTrack(args.current.loved);
    },

    //changes visual indication of love state for current track
    _setLoveStateForCurrentTrack: function(isLoved)
    {
        if(isLoved)
        {
            $(this.config.LoveButton).addClass(this.config.SelectedButtonClass);
        }
        else
        {
            $(this.config.LoveButton).removeClass(this.config.SelectedButtonClass);
        }
    },

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
            }
            else
            {
                that.view.find(that.config.LoopButton).removeClass(that.config.SelectedButtonClass);
            }
        };
    },

    _shufflePlaylist: function(model)
    {
        return function()
        {
            model.shuffle();
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
        this.view.find(this.config.LoveButton).click(this._changeLoveStateForCurrentTrack(this));
        this.view.find(this.config.ClearButton).click(this._clearPlaylist(this.playlistService));
        this.view.find(this.config.SaveButton).click(this._savePlaylist(this.playlistService));
        this.view.find(this.config.ShuffleButton).click(this._shufflePlaylist(this.playlistController));
        this.view.find(this.config.LoopButton).click(this._changeLoopModeState(this));

        EventBroker.getInstance().addListener(window.Player.Events.MediaChanged, this._handleMediaChanged, null, this);

        EventBroker.getInstance().addListener(window.UI.Events.EnableControlButtonsRequested, $.proxy(this._enableButtons, this));
        EventBroker.getInstance().addListener(window.UI.Events.DisableControlButtonsRequested, $.proxy(this._disableButtons, this));

        this._disableButtons();
    }
};
