window.Services = window.Services || {};

window.Services.SearchServiceConstants =
{
    RESOURCE_TYPE_PLAYLIST: "youtube#playlist",
    RESOURCE_TYPE_VIDEO: "youtube#video",
    URL_VIDEO: window.Google.GoogleApiConstants.YOUTUBE.URL,
    URL_PLAYLIST: window.Google.GoogleApiConstants.YOUTUBE.URL+"0&"+window.Google.GoogleApiConstants.YOUTUBE.LINK_PARAMS.PLAYLIST+"="
};