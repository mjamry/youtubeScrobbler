window.UI = window.UI || {};

window.UI.PageDisplayCoordinator = function()
{
    this._currentPage = null;
};

window.UI.PageDisplayCoordinator.prototype =
{
    _hide: function(page)
    {
        page.hide();
    },

    _show: function(page)
    {
        page.show();

    },

    showPage: function(page)
    {
        var pageView = $(page);
        if(this._currentPage !== null)
        {
            this._hide(this._currentPage);
        }

        this._show(pageView);
        this._currentPage = pageView;
        Logger.getInstance().debug("[PageDisp] Show page: "+page);
    }
};