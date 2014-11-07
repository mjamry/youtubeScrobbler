//namespace
window.Google = window.Google || {};

window.Google.GoogleApiConstants =
{
    MAX_NUMBER_OF_ITEMS_PER_REQUEST: 50,
    MAX_NUMBER_OF_SEARCH_RESULTS_PER_REQUEST: 50,
    YOUTUBE:
    {
        API: {
            //url with keys/ids: https://console.developers.google.com/project/scrobbline-001/apiui/credential
            AUTH:
            {
                CLIENT_ID: "545850510511-njg0onu8v94vgdqetnt1bhnptomevl74.apps.googleusercontent.com",
                SCOPE: "https://www.googleapis.com/auth/youtube"
            },
            KEY: "AIzaSyC4ABYBwDsCVEVcZG9KHSFqkAWINiSylQw",
            NAME: "youtube",
            VERSION: "v3"
        },

        LINK_PARAMS: {
            VIDEO: "v",
            PLAYLIST: "list"
        },

        URL: "http://www.youtube.com/watch?v=",
        MEDIA_TYPE: "video/youtube"
    }
};