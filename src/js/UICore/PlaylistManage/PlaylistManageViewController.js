window.UI = window.UI || {};

window.UI.PlaylistManageViewController = function(config, view, playlistManager)
{
    this.view = view;
    this.config = config;
    this.playlistManager = playlistManager;
};

window.UI.PlaylistManageViewController.prototype =
{
    initialise: function()
    {
        var playlistsDetails = this.playlistManager.loadPlaylistDetailsForAllPlaylists("Local");

        playlistsDetails.forEach(function(plDetails)
        {
            var playlistDetails = $("#controls-schemes "+this.config.PlaylistDetailsContainer).clone();
            playlistDetails.find(this.config.PlaylistName).append(plDetails.name);
            playlistDetails.find(this.config.PlaylistDescr).append(plDetails.description);
            playlistDetails.find(this.config.PlaylistItemsCount).append(plDetails.playlist.length());
            playlistDetails.find(this.config.PlaylistStorage).append(plDetails.storageType);


            this.view.append(playlistDetails);

        }.bind(this));





    }
};