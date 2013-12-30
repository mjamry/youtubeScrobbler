//namespace
window.Player = window.Player || {};

window.Player.PlaybackState = function()
{
    this.internalState = this.none;
};

window.Player.PlaybackState.prototype =
{
    stoped: "Stoped",
    playing: "Playing",
    paused: "Paused",
    none: "",

    changeState: function(state)
    {
        this.internalState = state;
    },

    getCurrentState: function()
    {
        return this.internalState;
    }
};