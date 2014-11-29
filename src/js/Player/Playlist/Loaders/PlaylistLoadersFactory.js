window.Playlist = window.Playlist || {};

window.Playlist.PlaylistLoaderConst =
{
    Youtube: ['youtube.com', 'youtu.be']
};

window.Playlist.PlaylistLoaderTypes =
{
    //add here new types of source (i.e. local files, vimeo etc.)
    Youtube: "youtube",
    Default: ""
};

window.Playlist.PlaylistLoadersFactory = function(dataProviders)
{
    this.dataProviders = dataProviders;
};

window.Playlist.PlaylistLoadersFactory.prototype =
{
    _detectLoaderType: function(url)
    {
        //check for youtube
        for(var i=0 ; i < window.Playlist.PlaylistLoaderConst.Youtube.length ; i++)
        {
            if(url.indexOf(window.Playlist.PlaylistLoaderConst.Youtube[i]) >= 0)
            {
                return window.Playlist.PlaylistLoaderTypes.Youtube;
            }
        }

        return window.Playlist.PlaylistLoaderTypes.Default;
    },

    create: function(url)
    {
        var loaderType = this._detectLoaderType(url);
        switch(loaderType)
        {
            case window.Playlist.PlaylistLoaderTypes.Youtube:
                return new window.Playlist.YouTubePlaylistLoader(this.dataProviders[window.Playlist.PlaylistLoaderTypes.Youtube]);

            default:
                return new window.Playlist.DefaultPlaylistLoader();
        }
    }
};