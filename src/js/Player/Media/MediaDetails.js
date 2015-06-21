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
    tags: [],

    _deepCopy: function(source)
    {
        var deepCopy = new window.Player.MediaDetails();
        for(var prop in source)
        {
            //check if property is not a function - as we need to copy only values
            if(source.hasOwnProperty(prop))
            {
                //if is an object need to copy all elements
                if(typeof(source[prop]) == "object")
                {
                    deepCopy[prop] = this._deepCopy(source[prop]);
                }
                else
                {
                    deepCopy[prop] = source[prop];
                }
            }
        }

        return deepCopy;
    },

    clone: function()
    {
        return this._deepCopy(this);
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
        this.tags = data.tags || [];
    }
};