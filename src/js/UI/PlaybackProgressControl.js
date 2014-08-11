//namespace
window.UI = window.UI || {};

window.UI.PlaybackProgressControl = function(view)
{
    this.view = view;
    this.playbackProgressChangedHandler = null;
    this.enabled = false;
};

window.UI.PlaybackProgressControl.prototype =
{
    _handlePlaybackProgressChange: function(that)
    {
        if(that.enabled)
        {
            return function changePlaybackProgressValue(eventArgs)
            {
                //calculate offset
                var target = eventArgs.target || eventArgs.srcElement,
                    rect = target.getBoundingClientRect(),
                    offsetX = eventArgs.clientX - rect.left;

                var width = eventArgs.currentTarget.clientWidth;

                var newPlaybackProgressValue = ((offsetX) / width) * 100;

                //set progress bar width
                that.view.find(".playback-progress-bar").css("width", newPlaybackProgressValue + "%");

                //fire an event
                that.playbackProgressChangedHandler(newPlaybackProgressValue);
            };
        }
    },

    bindToPlaybackProgressChangedEvent: function(callback)
    {
        this.playbackProgressChangedHandler = callback;
    },

    enable: function()
    {
        this.enabled = true;
    },

    disable: function()
    {
        this.enabled = false;
    },

    initialise: function()
    {
        this.view.click(this._handlePlaybackProgressChange(this));
    }
};

