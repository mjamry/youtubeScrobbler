//namespace
window.Common = window.Common || {};

LocalStorage = function()
{
    LocalStorage._instance = null;
};

LocalStorage.setInstance = function(instance)
{
    if(LocalStorage._instance !== null)
    {
        var errorMsg = "Instance of LocalStorage has been already set!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    LocalStorage._instance = instance;
};

LocalStorage.getInstance = function()
{
    if(LocalStorage._instance === null)
    {
        var errorMsg = "Instance of LocalStorage has not been set yet!";
        Logger.getInstance().Error(errorMsg);
        throw errorMsg;
    }

    return LocalStorage._instance;
};

window.Common.LocalStorageImpl = function(){};

window.Common.LocalStorageImpl.prototype =
{
    setData: function(name, value)
    {
        Logger.getInstance().Info("[LocalStorage] "+name+" has been saved.");
        localStorage.setItem(name, JSON.stringify(value));
    },

    getData: function(name)
    {
        var value = JSON.parse(localStorage.getItem(name));
        if(value)
        {
            Logger.getInstance().Info("[LocalStorage] "+name+" has been read.");
        }
        return value;
    },

    removeData: function(name)
    {
        Logger.getInstance().Info("[LocalStorage] "+name+" has been removed.");
        localStorage.removeItem(name);
    }
};