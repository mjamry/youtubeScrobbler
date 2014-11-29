//namespace
window.Google = window.Google || {};

window.Google.GoogleApiConstants =
{
    MAX_NUMBER_OF_ITEMS_PER_REQUEST: 50,
    MAX_NUMBER_OF_SEARCH_RESULTS_PER_REQUEST: 50,
    API_KEY: "AIzaSyC4ABYBwDsCVEVcZG9KHSFqkAWINiSylQw"
};

//TODO: move client id and key to server side
window.Google.AuthApi =
{
    //url with keys/ids: https://console.developers.google.com/project/scrobbline-001/apiui/credential
    CLIENT_ID: "545850510511-njg0onu8v94vgdqetnt1bhnptomevl74.apps.googleusercontent.com",
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

