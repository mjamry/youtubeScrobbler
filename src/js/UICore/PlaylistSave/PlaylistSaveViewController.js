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
        var description = this.view.find(this.config.PlaylistDescription).val();
        var playlist = this.playlistService.getPlaylist();

        var playlistDetails = new window.Playlist.PlaylistDetails();
        playlistDetails.playlist = playlist;
        playlistDetails.name = name;
        playlistDetails.id = name;
        playlistDetails.description = description;

        this.repository.save(name, playlist);
        EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistSaved, playlistDetails);
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

        var currentPlaylist = this.playlistService.getPlaylistDetails();

        if(currentPlaylist.name != null && currentPlaylist.id != null)
        {
            this.view.find(this.config.PlaylistName).val(currentPlaylist.name);
            this.view.find(this.config.PlaylistDescription).val(currentPlaylist.description);
            //TODO add repository and tags to the save dialog
        }

        this.modalId = ModalService.getInstance().show({content: this.view});
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.UI.PlaylistSaveEvents.PlaylistSaveRequested, this._handlePlaylistSaveRequested.bind(this));
    }
};