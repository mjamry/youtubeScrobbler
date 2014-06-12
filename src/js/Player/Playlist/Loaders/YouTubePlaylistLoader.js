//namespace
window.Player = window.Player || {};

//using
window.Common = window.Common || {};

//Main responsibility is to create playlists depending upon specified url address.
window.Playlist.YouTubePlaylistLoader = function(dataProvider)
{
    this.dataProvider = dataProvider;
    this.helper = window.Playlist.YouTubePlaylistLoader.Helper;
    //TODO - use as a service, only temporarily here
    this.progressbarService = new window.UI.ProgressbarService();
};

window.Playlist.YouTubePlaylistLoader.prototype =
{
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
        var progressbarId = null;
        var options = {id: ""};
        Logger.getInstance().debug("[YT] Obtaining details for videos ("+videosIds.length+")");
        return new Promise(function(resolve, reject)
        {
            function obtainVideoDetails(firstItemIndex)
            {
                var lastItemIndex = that.helper.getLastItemIndex(videosIds, firstItemIndex);
                options.id = that.helper.getVideosIds(videosIds, firstItemIndex, lastItemIndex);

                return function (response)
                {
                    Logger.getInstance().debug("[YT] obtained details for videos from range: [" + firstItemIndex + ":" + lastItemIndex + "]");
                    if (!response.error)
                    {
                        if(progressbarId === null)
                            progressbarId = that.progressbarService.addNewProgressBar(videosIds.length);
                        //add items to the array
                        items = items.concat(response.items);
                        that.progressbarService.updateProgress(progressbarId, lastItemIndex);
                        //get details for next items if are available
                        if (lastItemIndex < videosIds.length)
                        {
                            that.dataProvider.getVideoDetails(options, obtainVideoDetails(lastItemIndex));
                        }
                        else
                        {
                            that.progressbarId = null;
                            //all details obtained so get only interesting information.
                            resolve(that.helper.getVideosDetailsFromItems(items));
                        }
                    }
                    else
                    {
                        reject("[YT] Error occurs while obtaining video details. Msg: " + response.error.data[0].message + " reason: " + response.error.data[0].reason);
                    }
                };
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
        var progressbarId = null;
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
                    if(progressbarId === null)
                        progressbarId = that.progressbarService.addNewProgressBar(response.pageInfo.totalResults);
                    //add items to the array
                    items = items.concat(response.items);
                    that.progressbarService.updateProgress(progressbarId, items.length);
                    //get details for next items if are available
                    if (response.result.nextPageToken)
                    {
                        Logger.getInstance().debug("[YT] obtaining details for next part of playlist: "+response.result.nextPageToken);
                        options.pageToken = response.result.nextPageToken;
                        that.dataProvider.getPlaylistDetails(options, obtainPlaylistDetails);
                    }
                    else
                    {
                        that.progressbarId = null;
                        //all details obtained, so get only ids from response
                        resolve(that.helper.getPlaylistDetailsFromItems(items));
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

    //parses specified url address (form YT). Depending on url structure it loads playlist or single video.
    //returns playlist object literal: playlist = {title:string, videos:[{id, title}]};
    //playlist is returned via callback function
    loadPlaylist : function(url, callback)
    {
        Logger.getInstance().debug("[YT] Sending data request for url: "+url);
        var parser = new window.Common.UrlParser();
        var playlistId = parser.getParameterValue(url, window.Google.GoogleApiConstants.YOUTUBE.LINK_PARAMS.PLAYLIST);

        var errorHandler = function(error)
        {
            Logger.getInstance().warning(error);
        };

        if(playlistId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
        {
            new Promise(function(resolve)
                {
                    //does nothing - just pass an argument
                    resolve(playlistId);
                })
                .then(this._getPlaylistDetails.bind(this))
                .then(this._getVideoDetails.bind(this))
                .then(this.helper.getPlaylistFromItems.bind(this.helper))
                .then(callback)
                .catch(errorHandler);
        }
        else
        {
            var videoId = parser.getParameterValue(url, window.Google.GoogleApiConstants.YOUTUBE.LINK_PARAMS.VIDEO);
            if(videoId !== window.Common.UrlParserConstants.URL_PARSE_ERR)
            {
                new Promise(function(resolve)
                {
                    //does nothing - just pass an argument
                    resolve([videoId]);
                })
                    .then(this._getVideoDetails.bind(this))
                    .then(this.helper.getPlaylistFromItems.bind(this.helper))
                    .then(callback)
                    .catch(errorHandler);
            }
        }
    }
};

window.Playlist.YouTubePlaylistLoader.Helper =
{
    REGEX_NAMING_PATTERN: "([^\\-]*)-\\s?((?:[^\\{\\}\\(\\)\\[\\]]?)*)(.*)",

    generateMediaDetails: function(videoDetails)
    {
        var mediaDetails = new window.Player.MediaDetails();

        mediaDetails.mediaType = window.Google.GoogleApiConstants.YOUTUBE.MEDIA_TYPE;
        mediaDetails.duration = new window.Player.Duration(videoDetails.duration);

        var trackName = this.splitMediaTitle(videoDetails.title);

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

    getPlaylistDetailsFromItems: function(items)
    {
        var result = [];
        for(var i in items)
        {
            result.push(items[i].contentDetails.videoId);
        }

        return result;
    },

    getVideosDetailsFromItems: function(items)
    {
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

        return result;
    },

    getPlaylistFromItems: function(items, policy)
    {
        var playlist = new window.Player.Playlist();
        for (var i = 0; i < items.length; i++)
        {
            //TODO add a policy which will decide if item can be added to the playlist
            try
            {
                playlist.addItem(this.generateMediaDetails(items[i]));
            }
            catch(e)
            {
                Logger.getInstance().warning(e);
            }

        }

        return playlist;
    },

    splitMediaTitle: function(details)
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

    getLastItemIndex: function(videos, firstItemIndex)
    {
        var lastItemIndex = firstItemIndex+50;
        if (lastItemIndex > videos.length)
        {
            lastItemIndex = videos.length;
        }

        return lastItemIndex;
    },

    getVideosIds: function(videos, firstItemIndex, lastItemIndex)
    {
        var ids = [];
        for (var i = firstItemIndex; i < lastItemIndex; i++)
        {
            ids += videos[i] + ",";
        }
        //have to remove coma from the end
        ids = ids.substring(0, ids.length - 1);

        return ids;
    }
};

