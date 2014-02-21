window.Common = window.Common || {};

window.Common.GlobalErrorHandler = function(){};

window.Common.GlobalErrorHandler.prototype =
{
    _handleError: function(msg, url, lineNumber)
    {
        var fileName = url.split("/");
        fileName = fileName[fileName.length - 1];
        var message = "[ErrorHandler] Error: "+msg+" | occurred in: "+fileName+" line: "+lineNumber;
        Logger.getInstance().Error(message);
    },

    initialise: function()
    {
        var defaultHandler = window.onerror;

        window.onerror = $.proxy(function globalErrorHandler(msg, url, lineNumber)
        {
            this._handleError(msg, url, lineNumber);

            if(defaultHandler)
            {
                return defaultHandler(msg, url, lineNumber);
            }

            return false;
        }, this);
    }
};