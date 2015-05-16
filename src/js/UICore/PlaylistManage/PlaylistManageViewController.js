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
        var playlists = this.playlistManager.loadPlaylistDetailsForAllPlaylists("Local");
        var plNames = Object.keys(playlists);
        plNames.forEach(function(key)
        {
            var plDetails = playlists[key];
            var playlistDetails = $("#controls-schemes "+this.config.PlaylistDetailsContainer).clone();
            playlistDetails.find(this.config.PlaylistName).append(plDetails.name);
            playlistDetails.find(this.config.PlaylistDescr).append(plDetails.name);
            playlistDetails.find(this.config.PlaylistItemsCount).append(plDetails.name);
            playlistDetails.find(this.config.PlaylistStorage).append(plDetails.name);


            this.view.append(playlistDetails);

        }.bind(this));





    }
};