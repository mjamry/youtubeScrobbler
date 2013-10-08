//namespace
window.Player = window.Player || {};

//DTO - contains details specific for video/audio object.
window.Player.MediaDetails = function(){};

window.Player.MediaDetails.prototype =
{
    artist: "",
    title: "",
    duration: "", //new Time(...)
    url: "",
    mediaType: "",
    cover: ""
}