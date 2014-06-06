//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};

//Main responsibility is to create playlists depending upon specified url address.
window.Playlist.YouTubePlaylistLoader = function(dataProvider)
{
    this.dataProvider = dataProvider;
    //TODO move to more appropriate place
    this.REGEX_NAMING_PATTERN = "([^\\-]*)-\\s?((?:[^\\{\\}\\(\\)\\[\\]]?)*)(.*)";
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

    //videosIds - an array of videos' ids
    //example response
    //"items": [
    //    {
    //        "id": "xyz",
    //        "snippet": {
    //            "publishedAt": "2010-07-05T15:20:22.000Z",
    //            "channelId": "zxc",
    //            "title": "abc - def",
    //            "description": "abc",
    //            "thumbnails": {
    //                "default": {
    //                    "url": "https://abc.jpg",
    //                    "width": 120,
    //                    "height": 90
    //                },
    //                "medium": {
    //                    "url": "https://def.jpg",
    //                    "width": 320,
    //                    "height": 180
    //                },
    //                "high": {
    //                    "url": "https://ghi.jpg",
    //                    "width": 480,
    //                    "height": 360
    //                }
    //            },
    //            "channelTitle": "qwe",
    //            "categoryId": "10",
    //            "liveBroadcastContent": "none"
    //        },
    //        "contentDetails": {
    //            "duration": "PT6M1S",
    //            "dimension": "2d",
    //            "definition": "sd",
    //            "caption": "false",
    //            "licensedContent": false
    //        }
    //    }
    //]
    //}
    _getVideoDetails: function(videosIds)
    {
        var items = [];
        var that = this;
        var ids = "";
        var endIndex = 0;


        var options =
        {
            id: ids
        };
        Logger.getInstance().debug("[YT] Obtaining details for videos ("+videosIds.length+")");
        return new Promise(function(resolve, reject)
        {
            function obtainVideoDetails(startIndex)
            {
                ids = "";
                endIndex += 50;
                if (endIndex > videosIds.length)
                {
                    endIndex = videosIds.length;
                }
                for (var i = startIndex; i < endIndex-1; i++)
                {
                    ids += videosIds[i] + ",";
                }
                ids+= videosIds[endIndex-1];
                options.id = ids;
               return function(response) {

                   Logger.getInstance().debug("[YT] obtained details for videos from range: ["+startIndex+":"+endIndex+"]");
                    if (!response.error) {
                        //add items to array
                        items = items.concat(response.items);
                        //get details for next items

                        if (endIndex < videosIds.length)
                        {
                            that.dataProvider.getVideoDetails(options, obtainVideoDetails(endIndex));
                        }
                        else {
                            //all details obtained so get only interesting information.
                            var result = [];
                            for (var i in items) {
                                result.push(
                                    {
                                        id: items[i].id,
                                        title: items[i].snippet.title,
                                        duration: items[i].contentDetails.duration
                                    }
                                );
                            }
                            Logger.getInstance().debug("[YT] obtained details for: "+result.length+" videos");
                            resolve(result);
                        }

                    }
                    else {
                        reject("[YT] Error occurs while obtaining video details. Msg: " + response.error.data[0].message + " reason: " + response.error.data[0].reason);
                    }
                }
            }

            that.dataProvider.getVideoDetails(options, obtainVideoDetails(0));
        });
    },

    //example response:
    //"items": [
    //{
    //    "contentDetails": {
    //        "videoId": "abc"
    //    }
    //},
    //{
    //    "contentDetails": {
    //        "videoId": "def"
    //    }
    //}
    //]
    _getPlaylistDetails: function(playlistId)
    {
        var that = this;
        var items = [];
        var options =
        {
            playlistId: playlistId,
            pageToken: ""
        };
        Logger.getInstance().debug("[YT] Obtaining details for playlist id: "+playlistId);
        return new Promise(function(resolve, reject)
        {
           function obtainPlaylistDetails(response)
            {
                if(!response.error)
                {
                    //add items to the array
                    items = items.concat(response.items);
                    //get details for next items
                    if (response.result.nextPageToken)
                    {
                        Logger.getInstance().debug("[YT] obtaining details for next part of playlist: "+response.result.nextPageToken);
                        options.pageToken = response.result.nextPageToken;
                        that.dataProvider.getPlaylistDetails(options, obtainPlaylistDetails);
                    }
                    else
                    {
                        //all details obtained, so get only ids from response
                        var result = [];
                        for(var i in items)
                        {
                            result.push(items[i].contentDetails.videoId);
                        }

                        Logger.getInstance().debug("[YT] obtained ids of: "+result.length+" videos");
                        resolve(result);
                    }
                }
                else
                {
                    reject("[YT] Error occurs while obtaining playlist details. Msg: " + response.error.data[0].message + " reason: " + response.error.data[0].reason);
                }
            }
            //start obtaining data
            that.dataProvider.getPlaylistDetails(options, obtainPlaylistDetails);
        });
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
                playlist.addItem(this._obtainVideoDetails(items[i]));
            }
            catch(e)
            {
                Logger.getInstance().warning(e);
            }

        }

        Logger.getInstance().debug("[YT] Playlist created, contains "+playlist.length()+" items");
        return playlist;
    },

    _obtainVideoDetails: function(videoDetails)
    {
        var mediaDetails = new window.Player.MediaDetails();

        mediaDetails.mediaType = window.Google.GoogleApiConstants.YOUTUBE.MEDIA_TYPE;
        mediaDetails.duration = new window.Player.Duration(videoDetails.duration);

        var trackName = this._splitTitle(videoDetails.title);

        mediaDetails.artist = new window.Player.ArtistDetails(
            {
                name: trackName.artist,
                mbid: "",
                url: "",
                cover: ""
            }
        );

        mediaDetails.title = trackName.title;
        mediaDetails.url = window.Google.GoogleApiConstants.YOUTUBE.URL + videoDetails.id;

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
        var loader = new Promise(function(resolve)
        {
            resolve(playlistId);
        });
        if(playlistId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
        {
            loader.then(this._getPlaylistDetails.bind(this))
                .then(this._getVideoDetails.bind(this))
                .then(this._createPlaylistFromItems.bind(this))
                .then(callback)
                .catch(function(error)
                {
                    Logger.getInstance().error(error);
                });
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

