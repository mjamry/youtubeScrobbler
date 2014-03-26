//namespace
window.Player = window.Player || {};

//DTOs - contains details specific for video/audio object.

window.Player.ArtistDetails = function(details)
{
    return details ||
    {
        name: "",
        mbid: "",
        url: ""
    };
};

window.Player.AlbumDetails = function(details)
{
    return details ||
    {
        name: "",
        mbid: "",
        url: "",
        cover: ""
    };
};

window.Player.MediaDetails = function(){};

window.Player.MediaDetails.prototype =
{
    artist: new window.Player.ArtistDetails(),
    title: "",
    mbid: "",
    duration: "", //new Druation()
    url: "",
    mediaType: "",//type of media e.g. "video/youtube"
    id: "",       //media id from portal e.g lastFm - used to indicate if details has been already obtained
    album: new window.Player.AlbumDetails(),
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
    },

    deserialize: function(data)
    {
        this.artist = new window.Player.ArtistDetails(data.artist);
        this.album = new window.Player.AlbumDetails(data.album);
        this.title = data.title;
        this.mbid = data.mbid;
        this.duration = new window.Player.Duration(data.duration.duration);
        this.url = data.url;
        this.mediaType = data.mediaType;
        this.id = data.id;
        this.loved = data.loved;
    }
};