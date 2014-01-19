//namespace
window.Tracking = window.Tracking || {};

GoogleTracker = function()
{
    this._instance = null;
};

GoogleTracker.setInstance = function(instance)
{
    if(this._instance != null)
    {
        var errorMsg = "Instance of GoogleTracker has been already set!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    this._instance = instance;
};

GoogleTracker.getInstance = function()
{
    if(this._instance == null)
    {
        var errorMsg = "Instance of GoogleTracker has not been set yet!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    return this._instance;
};

//provides ability to track user actions
window.Tracking.GoogleEventTrackerImpl = function(config)
{
    Logger.getInstance().Info("Google tracker has been created.");
    this.config = config;
};

window.Tracking.GoogleEventTrackerImpl.prototype =
{
    trackUiAction: function(action, label, value)
    {
        if(!label && !value)
        {
            ga(this.config.SendParam, this.config.EventParam, this.config.UiCategory, action);
        }
        else if(!value)
        {
            ga(this.config.SendParam, this.config.EventParam, this.config.UiCategory, action, label);
        }
        else
        {
            ga(this.config.SendParam, this.config.EventParam, this.config.UiCategory, action, label, value);
        }
    }
};