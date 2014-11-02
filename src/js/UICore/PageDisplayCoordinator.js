window.UI = window.UI || {};

window.UI.PageDisplayCoordinator = function(startingPage)
{
    this._HIDDEN_PAGE_CLASS = "application-page-hidden";
    this._currentPage = $(startingPage);
    this._show(this._currentPage);
};

window.UI.PageDisplayCoordinator.prototype =
{
    _hide: function(page)
    {
        page.addClass(this._HIDDEN_PAGE_CLASS);
    },

    _show: function(page)
    {
        page.removeClass(this._HIDDEN_PAGE_CLASS);
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