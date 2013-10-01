//namespace
window.Player = window.Player || {};

//DTO - contains details specific for video/audio object.
window.Player.MediaDetails = function(){};

window.Player.MediaDetails.prototype =
{
    author: "",
    title: "",
    duration: "" //new Time(...)
}