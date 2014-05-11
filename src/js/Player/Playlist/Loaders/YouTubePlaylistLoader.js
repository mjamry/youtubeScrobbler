//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};

window.Playlist.YouTubePlaylistConstant =
{
    API_URL: "https://gdata.youtube.com/feeds/api/",
    API_VERSION: 2,
    FEED_PARAMS: "alt=jsonc&v=2",
    FEED_QUANTITY_PARAMS: "&max-results=50&start-index=",
    PLAYLIST_PARAMETER_NAME: "list",
    VIDEO_PARAMETER_NAME: "v",
    PLAYLIST_API_VALUE: "playlists/",
    VIDEOS_API_VALUE: "videos/",
    VIDEO_TITLE_ID: 1,
    ARTIST_NAME_ID: 0,
    MAX_NUMBER_OF_RESULTS: 10,
    VIDEO_NAME_SEPARATOR: "-",
    MEDIA_TYPE: "video/youtube",
    REGEX_NAMING_PATTERN: "([^\\-]*)-\\s?((?:[^\\{\\}\\(\\)\\[\\]]?)*)(.*)"
};

//Main responsibility is to create playlists depending upon specified url address.
window.Playlist.YouTubePlaylistLoader = function()
{
    this.googleApi = new window.Google.GoogleApiWrapper();
};

window.Playlist.YouTubePlaylistLoader.prototype =
{
    _splitTitle: function(details)
    {
        var namePattern = RegExp(window.Playlist.YouTubePlaylistConstant.REGEX_NAMING_PATTERN);
        var names = namePattern.exec(details);

        if(names)
        {
            return {
                artist: names[1],
                title: names[2]
            };
        }

        throw("[YT] Error occurs while parsing title. Incorrect naming pattern: "+details);
    },

    //gets details for specified clip.
    //if cannot retrieve details returns "undefined";
    //TODO - handle errors while parsing video details received from YT. It is possible that video has been deleted.
    _getMediaDetails: function(media)
    {
        Logger.getInstance().debug("[YT] Received details for media: "+media.title);
        var mediaDetails = new window.Player.MediaDetails();

        mediaDetails.mediaType = window.Playlist.YouTubePlaylistConstant.MEDIA_TYPE;
        mediaDetails.duration = new window.Player.Duration(media.duration);

        var trackName = this._splitTitle(media.title);

        //sometime media.player is empty - do not know why...
        if(!media.player)
        {
            throw("[YT] Cannot read media details. Probably file does not exist anymore: "+media.title);
        }

        mediaDetails.artist = new window.Player.ArtistDetails(
            {
                name: trackName.artist,
                mbid: "",
                url: "",
                cover: ""
            }
        );

        mediaDetails.title = trackName.title;
        mediaDetails.url = media.player.default;

        return mediaDetails;
    },

    _getVideoDetails: function(videoId, callback)
    {
        var options =
        {
            id: videoId
        };

        var that = this;

        var addVideoToThePlaylist = function(response)
        {
            var playlist = new window.Player.Playlist();
            playlist.addPlaylist(that._createPlaylistFromItems(response.result.items));
            callback(playlist);
        };

        this.googleApi.obtainVideoDetails(options, addVideoToThePlaylist);
    },

    _getPlaylistDetails: function(playlistId, callback)
    {
        var options =
        {
            playlistId: playlistId,
            pageToken: ""
        };
        //needed inside addItemsToThePlaylist function
        var that = this;

        var addItemsToThePlaylist = function(currentPlaylist)
        {
            return function(response)
            {
                currentPlaylist.addPlaylist(that._createPlaylistFromItems(response.result.items));

                if (response.result.nextPageToken)
                {
                    options.pageToken = response.result.nextPageToken;
                    that.googleApi.obtainPlaylistDetails(options, addItemsToThePlaylist(currentPlaylist));
                }
                else
                {
                    callback(currentPlaylist);
                }
            }
        };

        //start obtaining playlist items
        this.googleApi.obtainPlaylistDetails(options, addItemsToThePlaylist(new window.Player.Playlist()));
    },

    _createPlaylistFromItems: function(items)
    {
        var playlist = new window.Player.Playlist();
        for (var i = 0; i < items.length; i++)
        {
           // Logger.getInstance().debug("Item: " + items[i].snippet.title + " link: http://www.youtube.com/watch?v=" + items[i].snippet.resourceId.videoId);
            //TODO add a policy which will decide if item can be added to the playlist
            //this._itemAddingPolicy(playlist, item)
            playlist.addItem(this._obtainVideoDetails(items[i].snippet));
        }

        return playlist;
    },

    _obtainVideoDetails: function(video)
    {
        var mediaDetails = new window.Player.MediaDetails();
        mediaDetails.title = video.title;
        mediaDetails.duration = new window.Player.Duration(20);
        return mediaDetails;
    },

    //parses specified url address (form YT). Depending on url structure it loads playlist or single video.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    //playlist is returned via callback function
    loadPlaylist : function(url, callback)
    {
        Logger.getInstance().debug("[YT] Sending data request for url: "+url);
        var parser = new window.Common.UrlParser();
        var playlistId = parser.getParameterValue(url, window.Playlist.YouTubePlaylistConstant.PLAYLIST_PARAMETER_NAME);
        
        if(playlistId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
        {
            this._getPlaylistDetails(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, window.Playlist.YouTubePlaylistConstant.VIDEO_PARAMETER_NAME);
            if(videoId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
            {
                this._getVideoDetails(videoId, callback);
            }
        }
    }
};
