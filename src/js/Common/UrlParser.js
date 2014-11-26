//namespace
window.Common = window.Common || {};

window.Common.UrlParser = function()
{
    // &#/ - elements that can be found at the end of the url
    //for each search result will be:
    //$0 = param=value
    //$1 = param
    //$2 = value
    this.getUrlParamsRegexPattern = "/?(([\\w\\-]*)=([^&#/]*))";

    this.getPageUrlRegexPattern = "([^?]*)";

    this.urlTestRegexPattern = "(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})\\.*";
};

window.Common.UrlParser.prototype =
{
    //returns value for passed parameter. if it does not exist returns null
    getParameterValue : function(url, parameter)
    {
        var params = {};

        var generateKeyValuePair = function($0, $1, $2, $3)
        {
            params[$2] = $3;
        };

        //g - global flags, search will be executed multiple times
        var regex = new RegExp(this.getUrlParamsRegexPattern, "g");
        url.replace(regex, generateKeyValuePair);

        if(params.hasOwnProperty(parameter))
        {
            return params[parameter];
        }

        return null;
    },

    //returns page url without parameters
    getPageUrl:function(url)
    {
        var regex = new RegExp(this.getPageUrlRegexPattern);
        var urlElements = regex.exec(url);

        return urlElements[1];
    },

    //detects if passed value is an url
    isUrl: function(valueToTest)
    {
        var regex = new RegExp(this.urlTestRegexPattern);
        return regex.test(valueToTest);
    }
};
