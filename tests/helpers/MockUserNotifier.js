window.Tests = window.Tests || {};

window.Tests.MockUserNotifier = function(){};

window.Tests.MockUserNotifier.prototype =
{
    info: function showUserInformation(message, undoCallback)
    {
        //does nothing
    },

    error: function showUserError(message)
    {
        //does nothing
    }
};