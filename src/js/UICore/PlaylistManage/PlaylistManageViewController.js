window.UI = window.UI || {};

window.UI.PlaylistManageViewController = function(config, view, playlistManager)
{
    this.view = view;
    this.config = config;
    this.playlistManager = playlistManager;
};

window.UI.PlaylistManageViewController.prototype =
{
    _hookUpToClickAction: function(that)
    {
        return function()
        {
            var playlistDetailsItem = $(this);
            var id = playlistDetailsItem.find(that.config.PlaylistName).text();
            var storageType = playlistDetailsItem.find(that.config.PlaylistStorage).text();

            that.playlistManager.loadPlaylist(id, storageType);
        }
    },

    _updateView: function()
    {
        var playlistsDetails = this.playlistManager.loadPlaylistDetailsForAllPlaylists("Local");

        playlistsDetails.forEach(function(plDetails)
        {
            var playlistDetails = $("#controls-schemes "+this.config.PlaylistDetailsContainer).clone();
            playlistDetails.find(this.config.PlaylistName).append(plDetails.name);
            playlistDetails.find(this.config.PlaylistId).append(plDetails.id);
            playlistDetails.find(this.config.PlaylistDescr).append(plDetails.description);
            playlistDetails.find(this.config.PlaylistItemsCount).append(plDetails.playlist.length());
            playlistDetails.find(this.config.PlaylistStorage).append(plDetails.storageType);

            this.view.append(playlistDetails);

            playlistDetails.click(this._hookUpToClickAction(this));

        }.bind(this));
    },

    initialise: function()
    {
        this._updateView();
    }
};