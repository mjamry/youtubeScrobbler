//namespace
window.Common = window.Common || {};

//const values
window.Common.UrlParserConstants =
{
      URL_PARSE_ERR: "0",
      PARAMS_START_SIGN: "?",
      PARAMS_SEPARATOR: "&",
      PARAM_VALUE_INDICATOR: "="
};

window.Common.UrlParser = function(){};

window.Common.UrlParser.prototype =
{
    getParameterValue : function(url, parameter)
    {
        try
        {
            var urlParts = url.split(window.Common.UrlParserConstants.PARAMS_START_SIGN);
            var params = urlParts[1].split(window.Common.UrlParserConstants.PARAMS_SEPARATOR);
        }
        catch(ex)
        {
            Logger.getInstance().Warning("Url parsing has failed. Ex: "+ex);
            return window.Common.UrlParserConstants.URL_PARSE_ERR;
        }

        for(var i=0; i<params.length; i++)
        {
            var value = params[i].split(window.Common.UrlParserConstants.PARAM_VALUE_INDICATOR);
            if(value[0] === parameter)
            {
                return value[1];
            }
        }
        
        return window.Common.UrlParserConstants.URL_PARSE_ERR;
    }
};
