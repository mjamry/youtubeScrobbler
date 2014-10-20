//namespace
window.Player = window.Player || {};

window.Player.PlaybackStateHolder = function()
{
    this.internalState = this.none;
};

window.Player.PlaybackStateHolder.prototype =
{
    _changeState: function(state)
    {
        this.internalState = state;
    },

    changeToPause: function()
    {
        this._changeState(window.Player.PlaybackState.Paused);
    },

    changeToPlay: function()
    {
        this._changeState(window.Player.PlaybackState.Playing);
    },

    changeToStop: function()
    {
        this._changeState(window.Player.PlaybackState.Stopped);
    },

    getCurrentState: function()
    {
        return this.internalState;
    }
};
