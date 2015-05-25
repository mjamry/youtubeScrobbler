window.UI = window.UI || {};

window.UI.PlaylistManageViewController = function(config, view, playlistManager)
{
    this.view = view;
    this.config = config;
    this.playlistManager = playlistManager;

    var options =
    {
        valueNames: ["playlist-details-name", "playlist-details-id", "playlist-details-description"],
        //html() returns only inside of element, to there is a need to wrap everything in div and get parent's html
        item: $("#controls-schemes "+this.config.PlaylistDetailsContainer).clone().wrap("<div />").parent().html()
    };

    this.list = new List("playlist-manager", options);
};

window.UI.PlaylistManageViewController.prototype =
{
    _hookUpToClickAction: function(that)
    {
        return function()
        {
            var playlistDetailsItem = $(this);
            var id = playlistDetailsItem.find(that.config.PlaylistName).text();
            var storageType = playlistDetailsItem.find(that.config.PlaylistStorage).text();

            that.playlistManager.loadPlaylist(id, storageType);
        }
    },

    _updateView: function()
    {
        //clear the view
        this.view.empty();
        this._setUpView();
    },

    _setUpView: function()
    {
        var playlistsDetails = this.playlistManager.loadPlaylistDetailsForAllPlaylists("Local");



        this.list.add({
            "playlist-details-name": "a",
            "playlist-details-id": "b",
            "playlist-details-description": "c"
        });

        playlistsDetails.forEach(function(plDetails)
        {
            var item = {};
            item[this.config.PlaylistName] = plDetails.name;
            item[this.config.PlaylistId] = plDetails.id;
            item[this.config.PlaylistDescr] = plDetails.description;
            item[this.config.PlaylistItemsCount] = plDetails.playlist.length();
            item[this.config.PlaylistStorage] = plDetails.storageType;

            this.list.add(item);
            //var playlistDetails = $("#controls-schemes "+this.config.PlaylistDetailsContainer).clone();
            //playlistDetails.find().append(plDetails.name);
            //playlistDetails.find(this.config.PlaylistId).append(plDetails.id);
            //playlistDetails.find(this.config.PlaylistDescr).append(plDetails.description);
            //playlistDetails.find(this.config.PlaylistItemsCount).append(plDetails.playlist.length());
            //playlistDetails.find(this.config.PlaylistStorage).append(plDetails.storageType);
            //
            //this.view.find("ul").append(playlistDetails);
            //
            //playlistDetails.click(this._hookUpToClickAction(this));

        }.bind(this));



    },

    initialise: function()
    {
        this._setUpView();
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistSaved, this._updateView.bind(this));
    }
};