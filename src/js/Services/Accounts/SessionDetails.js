window.Accounts = window.Accounts || {};

//Simple DTO used to pass session details across the application
window.Accounts.SessionDetails = function()
{
};

window.Accounts.SessionDetails.prototype =
{
    AccountName: "",
    UserName: "",
    PictureUrl: "",
    Details: []
};