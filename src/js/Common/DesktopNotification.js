window.Common = window.Common || {};

DesktopNotification = function()
{
    DesktopNotification._instance = null;
};

DesktopNotification.setInstance = function(instance)
{
    if(DesktopNotification._instance !== null)
    {
        var errorMsg = "Instance of DesktopNotification has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    DesktopNotification._instance = instance;
};

DesktopNotification.getInstance = function()
{
    if(DesktopNotification._instance === null)
    {
        var errorMsg = "Instance of DesktopNotification has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return DesktopNotification._instance;
};

window.Common.DesktopNotificationImpl = function(){};

window.Common.DesktopNotificationImpl.prototype =
{
    show: function(title, body, url)
    {
        var options =
        {
            body: body
        };
        if(url)
        {
            $.extend(options, {url: url});
        }

        if (!("Notification" in window)) {
            Logger.getInstance().warning("Desktop notifications are not supported.");
        }

        // Let's check if the user is okay to get some notification
        else if (Notification.permission === "granted")
        {
            var notification = new Notification(title, options);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission)
            {
                // If the user is okay, let's create a notification
                if (permission === "granted")
                {
                    var notification = new Notification(title, options);
                }
            });
        }
    }
};