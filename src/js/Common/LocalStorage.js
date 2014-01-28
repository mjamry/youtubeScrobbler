//namespace
window.Common = window.Common || {};

LocalStorage = function()
{
    this.instance = null;
};

LocalStorage.setInstance = function(instance)
{
    if(this._instance != null)
    {
        var errorMsg = "Instance of LocalStorage has been already set!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    this._instance = instance;
};

LocalStorage.getInstance = function()
{
    if(this._instance == null)
    {
        var errorMsg = "Instance of LocalStorage has not been set yet!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    return this._instance;
};

window.Common.LocalStorageImpl = function(){};

window.Common.LocalStorageImpl.prototype =
{
    setData: function(name, value)
    {
        localStorage.setItem(name, JSON.stringify(value));
    },

    getData: function(name)
    {
        return JSON.parse(localStorage.getItem(name));
    },

    removeData: function(name)
    {
        localStorage.removeItem(name);
    }
};