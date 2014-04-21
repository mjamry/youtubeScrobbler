window.tests.helpers.MockUserNotifier = function(){};

window.tests.helpers.MockUserNotifier.prototype =
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