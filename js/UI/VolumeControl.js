//namespace
window.UI = window.UI || {};

window.UI.VolumeControl = function(view)
{
    this.view = $("#"+view);
    this.view.hide();
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
                offsetY = eventArgs.clientY - rect.top;


            var height = eventArgs.currentTarget.clientHeight;

            var newVolumeLvlInPercent = ((height - offsetY) / height)*100;
            that.view.find(".volume-control-indicator").css("height", newVolumeLvlInPercent+"%");
            that.view.hide();
            //this requires normalized value
            that.volumeSetCallback(newVolumeLvlInPercent/100);
        }
    },

    initialise: function()
    {
        this.view.find(".volume-control-indicator-container").click(this._handleNewVolumeLevelSet(this));
    },

    show: function(currentVolumeLevel)
    {
        this.view.show();
        this.view.find(".volume-control-indicator").css("height", (currentVolumeLevel*100)+"%");
    },

    //bind to event
    bindToVolumeSet: function(callback)
    {
        this.volumeSetCallback = callback;
    }
};