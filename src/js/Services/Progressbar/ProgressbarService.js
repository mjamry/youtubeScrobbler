//namespace
window.Services = window.Services || {};

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


window.Services.ProgressbarServiceImpl = function()
{
    //substitute for dictionary
    this.ids = [];
    this.lastId = 0;
};

window.Services.ProgressbarServiceImpl.prototype =
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
            title: title,
            maxValue: maxValue
        };

        EventBroker.getInstance().fireEventWithData(window.Services.ProgressbarServiceEvents.RegisterNewProgressbar, {id: newId, title: title});
        return newId;
    },

    updateProgressbar: function(id, currentValue)
    {
        var percentageValue = this._calculatePercentageValue(currentValue, this.ids[id].maxValue);
        EventBroker.getInstance().fireEventWithData(window.Services.ProgressbarServiceEvents.UpdateProgressbarStatus, {id: id, value: percentageValue});
        Logger.getInstance().debug("[PB] Title: "+this.ids[id].title+" (id:"+id+") value: "+currentValue+" ("+percentageValue+"%) of "+this.ids[id].maxValue);
    }
};

