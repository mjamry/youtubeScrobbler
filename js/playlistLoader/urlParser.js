var URL_PARSE_ERR = "0";

function urlParser()
{
}

urlParser.prototype = {
    getParameterValue : function(url, parameter)
    {
        var PARAMS_START_SIGN = "?";
        var PARAMS_CONNECTOR = "&";
        var PARAM_VALUE_INDICATOR = "=";
        
        var urlParts = url.split(PARAMS_START_SIGN);
        var params = urlParts[1].split(PARAMS_CONNECTOR); 
        for(var i=0;i<params.length;i++)
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
