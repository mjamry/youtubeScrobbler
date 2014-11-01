window.UI = window.UI || {};

window.UI.PageDisplayCoordinator = function(startingPage)
{
    this._currentPage = $(startingPage);
    this._show(this._currentPage);
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

        this._hide(this._currentPage);

        this._show(pageView);
        this._currentPage = pageView;
        Logger.getInstance().debug("[PageDisp] Show page: "+page);
    }
};