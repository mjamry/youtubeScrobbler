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

window.Common.UrlParser = function()
{
    //g - global flags, search will be executed multiple times
    // &#/ - elements that can be found at the end of the url
    //for each search result will be:
    //$0 = param=value
    //$1 = param
    //$2 = value
    this.urlRegex = new RegExp("/?(([\\w\\-]*)=([^&#/]*))", "g");
};

window.Common.UrlParser.prototype =
{
    getParameterValue : function(url, parameter)
    {
        var params = {};

        var generateKeyValuePair = function($0, $1, $2, $3)
        {
            params[$2] = $3;
        };

        url.replace(this.urlRegex, generateKeyValuePair);

        var parameterValue = params[parameter];

        if(parameterValue !== "undefined")
        {
            return parameterValue;
        }

        return null;
    }
};
