window.Services = window.Services || {};

window.Services.PlaylistManagementService = function(playlistRepositoryService, playlistService)
{
    this.playlistRepoService = playlistRepositoryService;
    this.playlistService = playlistService;
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
        var loadedPlaylistDetails = this.playlistRepoService.load(playlistDetails);
        this.playlistService.setPlaylist(loadedPlaylistDetails);
    }
};