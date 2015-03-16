//namespace
window.Google = window.Google || {};

window.Google.GoogleApiConstants =
{
    MAX_NUMBER_OF_ITEMS_PER_REQUEST: 50,
    MAX_NUMBER_OF_SEARCH_RESULTS_PER_REQUEST: 50
};

window.Google.ApiKeys = function()
{
    this.apiKeysPath = "php/GoogleApiKeys.php";
};

window.Google.ApiKeys.prototype =
{
    obtainKeys: function()
    {
        $.get(this.apiKeysPath, function(result)
        {
            result = JSON.parse(result);
            window.Google.ApiKeys.API_KEY = result.api_key;
            window.Google.ApiKeys.CLIENT_ID = result.client_id;
        })
    }
};

window.Google.ApiKeys.API_KEY = "";
window.Google.ApiKeys.CLIENT_ID = "";

window.Google.AuthApi =
{
    //url with keys/ids: https://console.developers.google.com/project/scrobbline-001/apiui/credential
    SCOPE_PROFILE: "https://www.googleapis.com/auth/userinfo.profile",
    SCOPE_EMAIL: "https://www.googleapis.com/auth/userinfo.email",
    NAME: "oauth2",
    VERSION: "v2"
};

window.Google.YoutubeApi =
{
    NAME: "youtube",
    VERSION: "v3",
    SCOPE: "https://www.googleapis.com/auth/youtube",

    LINK_PARAMS:
    {
        VIDEO: "v",
        PLAYLIST: "list"
    },

    URL: "http://www.youtube.com/watch?v=",
    MEDIA_TYPE: "video/youtube"
};

window.Google.ServiceNames =
{
    Youtube: window.Google.YoutubeApi.NAME,
    Auth: window.Google.AuthApi.NAME
};

