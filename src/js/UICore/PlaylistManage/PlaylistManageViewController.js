window.UI = window.UI || {};

window.UI.PlaylistManageViewController = function(config, view, playlistManager)
{
    this.view = view;
    this.config = config;
    this.playlistManager = playlistManager;

    var options =
    {
        valueNames: [
            this.config.values.name,
            this.config.values.id,
            this.config.values.description,
            this.config.values.count,
            this.config.values.storage
        ],
        //html() returns only inside of element, to there is a need to wrap everything in div and get parent's html
        item: $("#controls-schemes "+this.config.PlaylistDetailsContainer).clone().wrap("<div />").parent().html()
    };

    this.list = new List("playlist-manager", options);
};

window.UI.PlaylistManageViewController.prototype =
{
    _hookUpToClickAction: function(item)
    {
        return function()
        {
            this.playlistManager.loadPlaylist(item[this.config.values.id], item[this.config.values.storage]);
        }
    },

    _updateView: function()
    {
        //clear the view
        this.list.clear();
        this._setUpView();
    },

    _setUpView: function()
    {
        var playlistsDetails = this.playlistManager.loadPlaylistDetailsForAllPlaylists("Local");

        playlistsDetails.forEach(function(plDetails)
        {
            var item = {};
            item[this.config.values.name] = plDetails.name;
            item[this.config.values.id] = plDetails.id;
            item[this.config.values.description] = plDetails.description;
            item[this.config.values.count] = plDetails.playlist.length() + " item(s)";
            item[this.config.values.storage] = plDetails.storageType;

            this.list.add(item);

            var plItem = this.list.get(this.config.values.id, plDetails.id)[0].elm;
            $(plItem).click(this._hookUpToClickAction(item).bind(this));

        }.bind(this));
    },

    initialise: function()
    {
        this._setUpView();
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistSaved, this._updateView.bind(this));
    }
};