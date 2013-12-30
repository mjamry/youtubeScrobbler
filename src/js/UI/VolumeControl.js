//namespace
window.UI = window.UI || {};

window.UI.VolumeControl = function(view)
{
    this.view = $("#"+view);
    this.volumeSetCallback = null;
};

window.UI.VolumeControl.prototype =
{
    _handleNewVolumeLevelSet: function(that)
    {
        return function(eventArgs)
        {

            //calculate offset
            var target = eventArgs.target || eventArgs.srcElement,
                rect = target.getBoundingClientRect(),
                offsetX = eventArgs.clientX - rect.left;


            var width = eventArgs.currentTarget.clientWidth;

            var newVolumeLvlInPercent = ((offsetX) / width)*100;
            that.view.find(".volume-control-indicator").css("width", newVolumeLvlInPercent+"%");
            //this requires normalized value
            that.volumeSetCallback(newVolumeLvlInPercent/100);
        }
    },

    initialise: function(currentVolumeLevel)
    {
        this.view.find(".volume-control-indicator-container").click(this._handleNewVolumeLevelSet(this));
        //initialise startup value
        this.view.find(".volume-control-indicator").css("width", (currentVolumeLevel*100)+"%");
    },

    //bind to event
    bindToVolumeSet: function(callback)
    {
        this.volumeSetCallback = callback;
    }
};