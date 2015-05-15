window.Services = window.Services || {};

window.Services.PlaylistManagementService = function(playlistRepositoryService)
{
    this.playlistRepoService = playlistRepositoryService;
};

window.Services.PlaylistManagementService.prototype =
{
    loadPlaylistDetailsForAllPlaylists: function(repo)
    {
        var playlistRepos = this.playlistRepoService.availableRepositories();
        return playlistRepos[repo].getAllPlaylists();
    },

    loadPlaylist: function(playlistDetails)
    {
        //load playlist - using playlist service ?
        this.playlistRepoService.load(playlistDetails.id, playlistDetails.repository);
    },

    initialise: function()
    {
        var pl = this.loadPlaylistDetailsForAllPlaylists("Local");
    }
};