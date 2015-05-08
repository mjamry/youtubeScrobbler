window.UI = window.UI || {};

window.UI.PlaylistSaveViewController = function(config, playlistRepositoryService, playlistService)
{
    this.config = config;
    this.view = null;
    this.modalId;
    this.repository = playlistRepositoryService;
    this.playlistService = playlistService;
};

window.UI.PlaylistSaveViewController.prototype =
{
    _handlePlaylistSaveRequested: function()
    {
        this.show();
    },

    _savePlaylist: function()
    {
        var name = this.view.find(this.config.PlaylistName).val();
        var descr = this.view.find(this.config.PlaylistDescription).val();

        this.repository.save(name, this.playlistService.getPlaylist());
        this._close();
    },

    _close: function()
    {
        ModalService.getInstance().close(this.modalId);
    },

    show: function()
    {
        this.view = $("#controls-schemes "+this.config.Container).clone();

        this.view.find(this.config.SaveButton).click(this._savePlaylist.bind(this));
        this.view.find(this.config.CancelButton).click(this._close.bind(this));

        this.modalId = ModalService.getInstance().show({content: this.view});
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.UI.PlaylistSaveEvents.PlaylistSaveRequested, this._handlePlaylistSaveRequested.bind(this));
    }
};