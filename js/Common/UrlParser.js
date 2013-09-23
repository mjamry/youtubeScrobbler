//namespace
window.Common = window.Common || {};

//const values
UrlParserConstants =
{
      URL_PARSE_ERR: "0",
      PARAMS_START_SIGN: "?",
      PARAMS_SEPARATOR: "&",
      PARAM_VALUE_INDICATOR: "="
}

window.Common.UrlParser = function(){};

window.Common.UrlParser.prototype =
{
    getParameterValue : function(url, parameter)
    {
        try
        {
            var urlParts = url.split(UrlParserConstants.PARAMS_START_SIGN);
            var params = urlParts[1].split(UrlParserConstants.PARAMS_SEPARATOR);
        }
        catch(ex)
        {
            window.Common.Log.Error("Url parsing has failed. Ex: "+ex);
            return UrlParserConstants.URL_PARSE_ERR;
        }

        for(var i=0; i<params.length; i++)
        {
            var value = params[i].split(UrlParserConstants.PARAM_VALUE_INDICATOR);
            if(value[0] === parameter)
            {
                return value[1];
            }
        }
        
        return UrlParserConstants.URL_PARSE_ERR;
    }
};
