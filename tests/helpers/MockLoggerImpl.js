window.Tests = window.Tests || {};

window.Tests.MockLoggerImpl = function(){};

window.Tests.MockLoggerImpl.prototype =
{
    initialise: function()
    {
        //does nothing
    },

    info: function(message)
    {
        //does nothing
    },

    error: function(message)
    {
        //does nothing
    },

    warning: function(message)
    {
        //does nothing
    },

    debug: function(message)
    {
        //does nothing
    }
};