//namespace
window.Common = window.Common || {};

window.Common.Cookie = function()
{
    this._instance = null;
};

window.Common.Cookie.setInstance = function(instance)
{
    if(this._instance == null)
    {
        this._instance = instance;
    }
}

window.Common.Cookie.instance = function()
{
    if(this._instance)
    {
        return this._instance;
    }
    else throw "NonInitialisedException";
}

window.Common.CookieHandler = function()
{
    //configuration
    $.cookie.json = true;
};

window.Common.CookieHandler.prototype =
{
    setCookie: function(name, value, expiryTime)
    {
        window.Common.Log.Instance().Debug("Cookie has been created - " + name + " : "+ value);
        $.cookie(name, value, expiryTime);
    },

    getCookie: function(name)
    {
        var value = $.cookie(name)
        window.Common.Log.Instance().Debug("Cookie: " + name + " has been read and has value: " + value)
        return value;
    },

    removeCookie: function(name)
    {
        window.Common.Log.Instance().Debug("Cookie: "+ name +" has been removed.");
        $.removeCookie(name);
    }

}