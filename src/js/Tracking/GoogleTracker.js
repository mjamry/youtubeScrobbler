//namespace
window.Tracking = window.Tracking || {};

GoogleTracker = function()
{
    GoogleTracker._instance = null;
};

GoogleTracker.setInstance = function(instance)
{
    if(GoogleTracker._instance !== null)
    {
        var errorMsg = "Instance of GoogleTracker has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    GoogleTracker._instance = instance;
};

GoogleTracker.getInstance = function()
{
    if(GoogleTracker._instance === null)
    {
        var errorMsg = "Instance of GoogleTracker has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return GoogleTracker._instance;
};

//provides ability to track user actions
window.Tracking.GoogleEventTrackerImpl = function(config)
{
    Logger.getInstance().info("Google tracker has been created.");
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