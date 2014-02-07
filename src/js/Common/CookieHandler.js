//namespace
window.Common = window.Common || {};

Cookie = function()
{
    this._instance = null;
};

Cookie.setInstance = function(instance)
{
    if(this._instance !== null)
    {
        var errorMsg = "Instance of Cookie has been already set!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    this._instance = instance;
};

Cookie.getInstance = function()
{
    if(this._instance === null)
    {
        var errorMsg = "Instance of Cookie has not been set yet!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    return this._instance;
};

window.Common.CookieImpl = function()
{
    //configuration
    $.cookie.json = true;

    Logger.getInstance().Info("Cookies handler has been created.");
};

window.Common.CookieImpl.prototype =
{
    setCookie: function(name, value, expiryTime)
    {
        $.cookie(name, value, expiryTime);
        Logger.getInstance().Debug("[Cookie] It has been created - '" + name + "' : "+ value);
    },

    getCookie: function(name)
    {
        var value = $.cookie(name);
        if(value)
        {
            Logger.getInstance().Debug("[Cookie] '" + name + "' has been read and has value: " + value);
        }
        else
        {
            Logger.getInstance().Warning("[Cookie] '"+name+"' does not exist");
        }

        return value;
    },

    removeCookie: function(name)
    {
        $.removeCookie(name);
        Logger.getInstance().Debug("[Cookie] '"+ name +"' has been removed.");
    }
};