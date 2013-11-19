//namespace
window.Player = window.Player || {};

window.Player.PlaybackControlService = function(player, playlistService)
{
    this.player = player;
    this.playlistService = playlistService;
};

window.Player.PlaybackControlService.prototype =
{
    play: function()
    {
        this.player.play();
    },

    pause: function()
    {
        this.player.pause();
    },

    next: function()
    {
        this.playlistService.playNext();
    },

    previous: function()
    {
        this.playlistService.playPrevious();
    }
};

