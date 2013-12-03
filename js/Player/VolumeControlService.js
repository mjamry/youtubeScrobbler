//namespace
window.Player = window.Player || {};

window.Player.VolumeControlService = function(player)
{
    this.player = player;
    this.volumeStep = 0.1;
};

window.Player.VolumeControlService.prototype =
{
    setVolumeLevel: function(value)
    {
        this.player.setVolume(value);
    },

    getVolumeLevel: function()
    {
        return this.player.getVolume();
    },

    increase: function()
    {
        var currentVol = this.getVolumeLevel();
        currentVol += this.volumeStep;
        if(currentVol > 1)
        {
            currentVol = 1;
        }

        this.setVolumeLevel(currentVol);
    },

    decrease: function()
    {
        var currentVol = this.getVolumeLevel();
        currentVol += this.volumeStep;
        if(currentVol < 0)
        {
            currentVol = 0;
        }

        this.setVolumeLevel(currentVol);
    },

    mute: function()
    {

    }
};