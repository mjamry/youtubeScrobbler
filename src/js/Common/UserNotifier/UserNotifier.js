//namespace
window.Common = window.Common || {};

UserNotifier = function()
{
    UserNotifier._instance = null;
};

UserNotifier.setInstance = function(instance)
{
    if(UserNotifier._instance !== null)
    {
        var errorMsg = "Instance of UserNotifier has been already set!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    UserNotifier._instance = instance;
};

UserNotifier.getInstance = function()
{
    if(UserNotifier._instance === null)
    {
        var errorMsg = "Instance of UserNotifier has not been set yet!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    return UserNotifier._instance;
};

window.Common.UserNotifierImpl = function(){};

window.Common.UserNotifierImpl.prototype =
{
    info: function showUserInformation(message, undoCallback)
    {
        EventBroker.getInstance().fireEventWithData(
            window.Common.UserNotifierEvents.InfoNotificationRequested,
            {
                message: message,
                undoCallback: undoCallback
            }
        );
    },

    error: function showUserError(message)
    {
        EventBroker.getInstance().fireEventWithData(
            window.Common.UserNotifierEvents.ErrorNotificationRequested,
            {
                message: message
            }
        );
    }
};

