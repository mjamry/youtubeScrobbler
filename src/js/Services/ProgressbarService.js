//namespace
window.UI = window.UI || {};

window.UI.ProgressbarService = function()
{
    //substitute for dictionary
    this.ids = new Object();
    this.lastId = 0;
};

window.UI.ProgressbarService.prototype =
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