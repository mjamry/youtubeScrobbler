//namespace
window.Common = window.Common || {};

Cookie = function()
{
    Cookie._instance = null;
};

Cookie.setInstance = function(instance)
{
    if(Cookie._instance !== null)
    {
        var errorMsg = "Instance of Cookie has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    Cookie._instance = instance;
};

Cookie.getInstance = function()
{
    if(Cookie._instance === null)
    {
        var errorMsg = "Instance of Cookie has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return Cookie._instance;
};

window.Common.CookieImpl = function()
{
    //configuration
    $.cookie.json = true;

    Logger.getInstance().info("Cookies handler has been created.");
};

window.Common.CookieImpl.prototype =
{
    setCookie: function(name, value, expiryTime)
    {
        $.cookie(name, value, {expires: expiryTime});
        Logger.getInstance().debug("[Cookie] It has been created - '" + name + "' : "+ value);
    },

    getCookie: function(name)
    {
        var value = $.cookie(name);
        if(value)
        {
            Logger.getInstance().debug("[Cookie] '" + name + "' has been read and has value: " + value);
            return value;
        }
        else
        {
            Logger.getInstance().warning("[Cookie] '"+name+"' does not exist");
            return null;
        }
    },

    removeCookie: function(name)
    {
        $.removeCookie(name);
        Logger.getInstance().debug("[Cookie] '"+ name +"' has been removed.");
    }
};