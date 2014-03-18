//namespace
window.Player = window.Player || {};

//DTO - contains details specific for video/audio object.
window.Player.MediaDetails = function()
{
};

window.Player.MediaDetails.prototype =
{
    artist:
    {
        name: "",
        mbid: "",
        url: ""
    },
    title: "",
    mbid: "",
    duration: "", //new Druation()
    url: "",
    mediaType: "",//type of media e.g. "video/youtube"
    id: "",       //media id from portal e.g lastFm - used to indicate if details has been already obtained
    album:
    {
        name: "",
        mbid: "",
        url: "",
        cover: ""
    },
    loved: "",       //determine if track has been loved already
    tags: "",

    clone: function()
    {
        var deepCopy = new window.Player.MediaDetails();

        for(var prop in this)
        {
            //check if property is not a function - as we need to copy only values
            if(this.hasOwnProperty(prop))
            {
                //copy property value
                deepCopy[prop] = this[prop];
            }
        }

        return deepCopy;
    }
};