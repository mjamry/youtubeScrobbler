//namespace
window.UI = window.UI || {};

window.UI.VolumeControl = function(view, config)
{
    this.view = $(view);
    this.volumeSetCallback = null;
    this.config = config;
    this.isEnabled = true;
};

window.UI.VolumeControl.prototype =
{
    _setIndicatorSize: function(sizePercentageValue)
    {
        this.view.find(this.config.VolumeControlIndicator).css("width", sizePercentageValue+"%");
    },

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
                that._setIndicatorSize(newPercentageValue);
                //this requires normalized value
                that.volumeSetCallback(newPercentageValue/100);
            }
        };
    },

    initialise: function(currentVolumeLevel)
    {
        this.view.find(this.config.VolumeControlContainer).click(this._handleNewVolumeLevelSet(this));
        //initialise startup value
        this._setIndicatorSize((currentVolumeLevel*100));
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