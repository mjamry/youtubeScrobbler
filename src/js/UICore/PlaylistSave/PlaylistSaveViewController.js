window.UI = window.UI || {};

window.UI.PlaylistSaveViewController = function(config, playlistRepositoryService, playlistService)
{
    this.config = config;
    this.view = null;
    this.modalId = null;
    this.repository = playlistRepositoryService;
    this.playlistService = playlistService;

    this.topTagsGenerator = new window.UI.PlaylistTagsGenerator();

    this.tagList;
};

window.UI.PlaylistSaveViewController.prototype =
{
    _handlePlaylistSaveRequested: function()
    {
        this.show();
    },

    _savePlaylist: function()
    {
        var playlistDetails = new window.Playlist.PlaylistDetails();
        playlistDetails.playlist = this.playlistService.getPlaylist();
        playlistDetails.name = this.view.find(this.config.PlaylistName).val();
        playlistDetails.id = this.view.find(this.config.PlaylistName).val();
        playlistDetails.description = this.view.find(this.config.PlaylistDescription).val();
        playlistDetails.storageType = this.view.find(this.config.PlaylistStorage).val();
        var tags = [];
        this.tagList.items.forEach(function(item)
        {
            tags.push(item._values);
        });

        playlistDetails.tags = tags;
        playlistDetails.isAlreadySaved = true;

        this.repository.save(playlistDetails);
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

        if(currentPlaylist.isAlreadySaved)
        {
            this.view.find(this.config.PlaylistName).val(currentPlaylist.name);
            this.view.find(this.config.PlaylistDescription).val(currentPlaylist.description);
        }

        var tags =  this.topTagsGenerator.generate(currentPlaylist.playlist);
        this.modalId = ModalService.getInstance().show({content: this.view});

        this.tagList = new List(this.config.PlaylistTagsContainer, {item: this.config.PlaylistTagTemplate});
        this.tagList.add(tags);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.UI.PlaylistSaveEvents.PlaylistSaveRequested, this._handlePlaylistSaveRequested.bind(this));
    }
};