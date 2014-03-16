//namespace
window.UI = window.UI || {};

window.UI.VolumeControl = function(view, config)
{
    this.view = $("#"+view);
    this.volumeSetCallback = null;
    this.config = config;
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
            that.view.find(this.config.VolumeControlIndicator).css("width", newVolumeLvlInPercent+"%");
            //this requires normalized value
            that.volumeSetCallback(newVolumeLvlInPercent/100);
        };
    },

    initialise: function(currentVolumeLevel)
    {
        this.view.find(this.config.VolumeControlContainer).click(this._handleNewVolumeLevelSet(this));
        //initialise startup value
        this.view.find(this.VolumeControlIndicator).css("width", (currentVolumeLevel*100)+"%");
    },

    //bind to event
    bindToVolumeSet: function(callback)
    {
        this.volumeSetCallback = callback;
    }
};