//namespace
window.Common = window.Common || {};

//const values
var URL_PARSE_ERR = "0";
var PARAMS_START_SIGN = "?";
var PARAMS_SEPARATOR = "&";
var PARAM_VALUE_INDICATOR = "=";

window.Common.UrlParser = function(){};

window.Common.UrlParser.prototype =
{
    getParameterValue : function(url, parameter)
    {
        try
        {
            var urlParts = url.split(PARAMS_START_SIGN);
            var params = urlParts[1].split(PARAMS_SEPARATOR);
        }
        catch(ex)
        {
            window.Common.Log.Error("Url parsing has failed. Ex: "+ex);
            return URL_PARSE_ERR;
        }

        for(var i=0; i<params.length; i++)
        {
            var value = params[i].split(PARAM_VALUE_INDICATOR);
            if(value[0] === parameter)
            {
                return value[1];
            }
        }
        
        return URL_PARSE_ERR;
    }
};
