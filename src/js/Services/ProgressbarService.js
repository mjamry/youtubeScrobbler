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
    addNewProgressBar: function(maxValue)
    {
        var newId = this._generateId();
        this.ids[newId] =
        {
            maxValue: maxValue
        };

        EventBroker.getInstance().fireEventWithData(window.UI.ProgressbarServiceEvents.RegisterNewProgressbar, newId);

        return newId;
    },

    updateProgress: function(id, currentValue)
    {
        var percentageValue = this._calculatePercentageValue(currentValue, this.ids[id].maxValue);
        EventBroker.getInstance().fireEventWithData(window.UI.ProgressbarServiceEvents.UpdateProgressbarStatus, {id: id, value: percentageValue});
    }
};

window.UI.ProgressbarServiceEvents =
{
    RegisterNewProgressbar: "RegisterNewProgressbar",
    UpdateProgressbarStatus: "UpdateProgressbarStatus"
};