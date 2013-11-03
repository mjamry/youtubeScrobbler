//namespace
window.Player = window.Player || {};

//DTO - contains details specific for video/audio object.
window.Player.MediaDetails = function(){};

window.Player.MediaDetails.prototype =
{
    artist: "",
    title: "",
    duration: "", //new Druation()
    url: "",
    mediaType: "",//type of media e.g. "video/youtube"
    id: "",       //media id from portal e.g YT or vimeo
    cover: "",     //link to cover - from LastFm
    loved: ""       //determine if track has been loved already
};