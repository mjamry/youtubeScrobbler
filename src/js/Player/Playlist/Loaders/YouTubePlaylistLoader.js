//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};

//Main responsibility is to create playlists depending upon specified url address.
window.Playlist.YouTubePlaylistLoader = function()
{
    this.googleApi = new window.Google.GoogleApiWrapper();
    //TODO move to more appropriate place
    this.REGEX_NAMING_PATTERN = "([^\\-]*)-\\s?((?:[^\\{\\}\\(\\)\\[\\]]?)*)(.*)"
};

window.Playlist.YouTubePlaylistLoader.prototype =
{
    _splitTitle: function(details)
    {
        var namePattern = RegExp(this.REGEX_NAMING_PATTERN);
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
            };
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
            try
            {
                playlist.addItem(this._obtainVideoDetails(items[i].snippet));
            }
            catch(e)
            {
                Logger.getInstance().warning(e);
            }

        }

        return playlist;
    },

    _obtainVideoDetails: function(video)
    {
        var mediaDetails = new window.Player.MediaDetails();

        mediaDetails.mediaType = window.Google.GoogleApiConstants.YOUTUBE.MEDIA_TYPE;
        mediaDetails.duration = new window.Player.Duration(20);

        var trackName = this._splitTitle(video.title);

        mediaDetails.artist = new window.Player.ArtistDetails(
            {
                name: trackName.artist,
                mbid: "",
                url: "",
                cover: ""
            }
        );

        mediaDetails.title = trackName.title;
        mediaDetails.url = window.Google.GoogleApiConstants.YOUTUBE.URL + video.resourceId.videoId;

        return mediaDetails;
    },

    //parses specified url address (form YT). Depending on url structure it loads playlist or single video.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    //playlist is returned via callback function
    loadPlaylist : function(url, callback)
    {
        Logger.getInstance().debug("[YT] Sending data request for url: "+url);
        var parser = new window.Common.UrlParser();
        var playlistId = parser.getParameterValue(url, window.Google.GoogleApiConstants.YOUTUBE.LINK_PARAMS.PLAYLIST);
        
        if(playlistId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
        {
            this._getPlaylistDetails(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, window.Google.GoogleApiConstants.YOUTUBE.LINK_PARAMS.VIDEO);
            if(videoId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
            {
                this._getVideoDetails(videoId, callback);
            }
        }
    }
};
