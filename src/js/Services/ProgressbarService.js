//namespace
window.UI = window.UI || {};

ProgressbarService = function()
{
    ProgressbarService._instance = null;
};

ProgressbarService.setInstance = function(instance)
{
    if(ProgressbarService._instance !== null)
    {
        var errorMsg = "Instance of ProgressbarService has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    ProgressbarService._instance = instance;
};

ProgressbarService.getInstance = function()
{
    if(ProgressbarService._instance === null)
    {
        var errorMsg = "Instance of ProgressbarService has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return ProgressbarService._instance;
};


window.Common.ProgressbarServiceImpl = function()
{
    //substitute for dictionary
    this.ids = new Object();
    this.lastId = 0;
};

window.Common.ProgressbarServiceImpl.prototype =
{
    _generateId: function()
    {
        return this.lastId++;
    },

    _calculatePercentageValue: function(currentValue, maxValue)
    {
        return Math.floor((currentValue / maxValue) * 100);
    },

    //returns progressbar id as a reference
    addNewProgressbar: function(maxValue, title)
    {
        title = title || "";
        var newId = this._generateId();
        this.ids[newId] =
        {
            maxValue: maxValue
        };

        EventBroker.getInstance().fireEventWithData(window.UI.ProgressbarServiceEvents.RegisterNewProgressbar, {id: newId, title: title});
        Logger.getInstance().debug("[PB] New progressbar. MaxValue: "+maxValue+" title: "+title);

        return newId;
    },

    updateProgressbar: function(id, currentValue)
    {
        Logger.getInstance().debug("[PB] id: "+id+" value: "+currentValue);
        var percentageValue = this._calculatePercentageValue(currentValue, this.ids[id].maxValue);
        EventBroker.getInstance().fireEventWithData(window.UI.ProgressbarServiceEvents.UpdateProgressbarStatus, {id: id, value: percentageValue});
        Logger.getInstance().debug("[PB] id: "+id+" value: "+percentageValue+"%");
    }
};

window.UI.ProgressbarServiceEvents =
{
    RegisterNewProgressbar: "RegisterNewProgressbar",
    UpdateProgressbarStatus: "UpdateProgressbarStatus"
};