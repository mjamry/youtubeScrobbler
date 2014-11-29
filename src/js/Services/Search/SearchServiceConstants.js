window.Services = window.Services || {};

window.Services.SearchServiceConstants =
{
    RESOURCE_TYPE_PLAYLIST: "youtube#playlist",
    RESOURCE_TYPE_VIDEO: "youtube#video",
    URL_VIDEO: window.Google.YoutubeApi.URL,
    URL_PLAYLIST: window.Google.YoutubeApi.URL+"0&"+window.Google.YoutubeApi.LINK_PARAMS.PLAYLIST+"="
};