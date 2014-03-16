//namespace
window.UI = window.UI || {};

window.UI.VolumeControl = function(view, config)
{
    this.view = $(view);
    this.volumeSetCallback = null;
    this.config = config;
    this.isEnabled = false;
};

window.UI.VolumeControl.prototype =
{
    _handleNewVolumeLevelSet: function(that)
    {
        return function(eventArgs)
        {
            if(that.isEnabled)
            {
                //calculate offset
                var target = eventArgs.target || eventArgs.srcElement,
                    rect = target.getBoundingClientRect(),
                    offsetX = eventArgs.clientX - rect.left;


                var width = eventArgs.currentTarget.clientWidth;

                var newPercentageValue = ((offsetX) / width)*100;
                that.view.find(that.config.VolumeControlIndicator).css("width", newPercentageValue+"%");
                //this requires normalized value
                that.volumeSetCallback(newPercentageValue/100);
            }
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
    },

    disable: function()
    {
        this.isEnabled = false;
    },

    enable: function()
    {
        this.isEnabled = true;
    }
};