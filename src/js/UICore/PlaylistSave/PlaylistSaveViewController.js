window.UI = window.UI || {};

window.UI.PlaylistSaveViewController = function(config, playlistRepositoryService, playlistService)
{
    this.config = config;
    this.view = null;
    this.modalId = null;
    this.repository = playlistRepositoryService;
    this.playlistService = playlistService;
};

window.UI.PlaylistSaveViewController.prototype =
{
    _handlePlaylistSaveRequested: function()
    {
        this.show();
    },

    _savePlaylist: function()
    {
        var playlistDetails = new window.Playlist.PlaylistDetails();
        playlistDetails.playlist = this.playlistService.getPlaylist();
        playlistDetails.name = this.view.find(this.config.PlaylistName).val();
        playlistDetails.id = this.view.find(this.config.PlaylistName).val();
        playlistDetails.description = this.view.find(this.config.PlaylistDescription).val();
        playlistDetails.storageType = this.view.find(this.config.PlaylistStorage).val();
      //  playlistDetails.tags = this.view.find(this.config.Playlist)

        this.repository.save(playlistDetails);
        EventBroker.getInstance().fireEventWithData(window.Player.PlaylistEvents.PlaylistSaved, playlistDetails);
        this._close();
    },

    _close: function()
    {
        ModalService.getInstance().close(this.modalId);
    },

    _getPlaylistTopTags: function(playlist)
    {
        var NB_OF_TOP_TAGS = 5;

        function sort(a,b)
        {
            console.log(";");
            if(a.count < b.count)
                return 1;
            if(a.count > b.count)
                return -1;
            return 0;
        }

        var allTags = [];

        for(var i=0;i<playlist.length();i++)
        {
            var trackTags = playlist.get(i).tags;

            for(var j=0;j<trackTags.length;j++)
            {
                if(!allTags.hasOwnProperty(trackTags[j].name))
                {
                    allTags[trackTags[j].name] = {tag: trackTags[j], count: 0};
                }

                allTags[trackTags[j].name].count++;
            }
        }

        var allTagsToSort = [];
        var i = 0;
        for(var key in allTags)
        {
            allTagsToSort[i] = allTags[key];
            i++;
        }

        allTagsToSort.sort(sort);
        console.log(allTagsToSort);

        var topTags = allTagsToSort.slice(0, NB_OF_TOP_TAGS);

        var output = [];
        for(var i=0;i<topTags.length;i++)
        {
            output[i] = topTags[i].tag;
        }

        return output;
    },

    show: function()
    {
        this.view = $("#controls-schemes "+this.config.Container).clone();

        this.view.find(this.config.SaveButton).click(this._savePlaylist.bind(this));
        this.view.find(this.config.CancelButton).click(this._close.bind(this));

        var currentPlaylist = this.playlistService.getPlaylistDetails();

        if(currentPlaylist.name !== null && currentPlaylist.id !== null)
        {
            this.view.find(this.config.PlaylistName).val(currentPlaylist.name);
            this.view.find(this.config.PlaylistDescription).val(currentPlaylist.description);
        }

        var tags =  this._getPlaylistTopTags(currentPlaylist.playlist);

        var tagsContainer = this.view.find(this.config.PlaylistTagsContainer);
        tags.forEach(function(tag)
        {
            var tagLabel = document.createElement("div");
            tagLabel.className += this.config.PlaylistTagItem;
            tagLabel.innerHTML = tag.name;
            tagsContainer.append(tagLabel);
        }.bind(this));

        this.modalId = ModalService.getInstance().show({content: this.view});
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.UI.PlaylistSaveEvents.PlaylistSaveRequested, this._handlePlaylistSaveRequested.bind(this));
    }
};