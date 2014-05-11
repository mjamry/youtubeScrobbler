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

    //creates playlist using details obtained from youtube
    _createPlaylist: function(list)
    {
        var playlist = new window.Player.Playlist();
        for (var i = 0; i < list.length; i++)
        {
            //TODO - it is only temporary needed for debugging
            if(list[i].video.restrictions)
            {
                var restr = list[i].video.restrictions;
                Logger.getInstance().debug("[YT] Playback restrictions: "+restr.length+" | relationship: "+restr[0].relationship+" | type: "+restr[0].type+" | countries: "+restr[0].countries);
            }
            var mediaDetails = null;
            try
            {
                Logger.getInstance().debug("[YT] try to obtain media details for "+list[i].video.title);
                mediaDetails = this._getMediaDetails(list[i].video);
            }
            catch(e)
            {
                Logger.getInstance().warning(e);
            }

            if (mediaDetails !== null)
            {
                Logger.getInstance().debug("[YT] new item added to the playlist: "+mediaDetails.artist.name+" - "+mediaDetails.title);
                playlist.addItem(mediaDetails);
            }
        }

        return playlist;
    },

    //gets playlist using playlist id. When finished it calls callback function to return data.
    _obtainPlaylistDetails : function(id, callback)
    {
        var playlist = new window.Player.Playlist();
        var url = window.Playlist.YouTubePlaylistConstant.API_URL +
            window.Playlist.YouTubePlaylistConstant.PLAYLIST_API_VALUE +
            id +
            window.Common.UrlParserConstants.PARAMS_START_SIGN +
            window.Playlist.YouTubePlaylistConstant.FEED_PARAMS +
            window.Playlist.YouTubePlaylistConstant.FEED_QUANTITY_PARAMS;

        UserNotifier.getInstance().info("Please wait - loading youtube playlist details.");
        //TODO i belieave that it can be done in better way
        (function __obtainPlaylistDetails(playlist, callback, that)
        {
            return function getPlaylistFromYoutube(startingIndex)
            {
                var endIndex = startingIndex + window.Playlist.YouTubePlaylistConstant.MAX_NUMBER_OF_RESULTS;
                //startingIndex++;
                Logger.getInstance().debug("[YT] Playlist details request for items in range: "+startingIndex+" - "+endIndex);
                $.getJSON(url+startingIndex, function(result)
                {
                    Logger.getInstance().debug("[YT] pl loading result: "+JSON.stringify(result));
                    if(result.data.items)
                    {
                        var list = result.data.items;
                        playlist.addPlaylist(that._createPlaylist(list));

                        Logger.getInstance().debug("[YT] new playlist length: "+playlist.length());
                        //check if all videos details are obtained if not increment start_index and call this function once again
                        //at the end call callback passing created playlist
                        if(result.data.items.length >= window.Playlist.YouTubePlaylistConstant.MAX_NUMBER_OF_RESULTS)
                        {
                            Logger.getInstance().debug("[YT] getting next part of items");
                            getPlaylistFromYoutube(endIndex);
                        }
                        else
                        {
                            Logger.getInstance().debug("[YT] playlist loading finished. Pl contains "+playlist.length()+" items");
                            callback(playlist);
                        }
                    }
                });
            };
        })(playlist, callback, this)(1);
    },
            
    //gets video data using id. When finish it calls callback function to return data.
    _obtainVideoDetails : function(id, callback)
    {
        var playlist = null;
        var url = window.Playlist.YouTubePlaylistConstant.API_URL +
            window.Playlist.YouTubePlaylistConstant.VIDEOS_API_VALUE +
            id +
            window.Common.UrlParserConstants.PARAMS_START_SIGN +
            window.Playlist.YouTubePlaylistConstant.FEED_PARAMS;

        Logger.getInstance().debug("[YT] Video details request");
        UserNotifier.getInstance().info("Please wait - loading youtube video details.");
        $.getJSON(url, $.proxy(function(result)
        {
            //create a table from result
            playlist = this._createPlaylist([{video:result.data}]);
            //TODO what if playlist is empty?
            callback(playlist);
        },
        this));
    },

    _newWayOfGettingPlaylistDetails: function(playlistId, callback)
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
            Logger.getInstance().debug("Item: " + items[i].snippet.title + " link: http://www.youtube.com/watch?v=" + items[i].snippet.resourceId.videoId);
            //TODO add policy which will decide if item can be added to the playlist
            //this._itemAddingPolicy(playlist, item)
            playlist.addItem(this._obtainVideoDetails(items[i].snippet));
        }

        return playlist;
    },

    _obtainVideoDetails: function(video)
    {
        var mediaDetails = new window.Player.MediaDetails();
        mediaDetails.title = video.title;

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
            //this._obtainPlaylistDetails(playlistId, callback);
            this._newWayOfGettingPlaylistDetails(playlistId, callback);
        }
        else
        {
            var videoId = parser.getParameterValue(url, window.Playlist.YouTubePlaylistConstant.VIDEO_PARAMETER_NAME);
            if(videoId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
            {
                this._obtainVideoDetails(videoId, callback);
            }
        }
    }
};
