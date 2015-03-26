//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index, config)
{
    this._index = index;
    this._config = config;
    this._item = null;
    this._cover = null;
};

window.UI.PlaylistUIItemBuilder.prototype =
{
    _createContextMenu: function()
    {
        var contextMenuBuilder = new window.UI.ContextMenuBuilder(window.UI.ContextMenuConfiguration);
        contextMenuBuilder.addItem(this._config.EditIcon, "Rename", function(){alert("rename")});
        contextMenuBuilder.addSeparator();
        contextMenuBuilder.addItem(this._config.CopyIcon, "Copy name", function(){alert("copied name")});
        contextMenuBuilder.addItem(this._config.CopyIcon, "Copy url", function(){alert("copied url")});
        contextMenuBuilder.addSeparator();
        contextMenuBuilder.addItem(this._config.DeleteIcon, "Delete", function(){alert("delete")});

        var menu = contextMenuBuilder.build();
        this._item.append(menu.getBody());

        var contextMenuHandler = function (contextmenu)
        {
            return function onContextMenuRequested(e)
            {
                e.preventDefault();
                contextmenu.show({top: e.pageY, left: e.pageX});
            }
        };

        this._item.on("contextmenu", contextMenuHandler(menu));

        menu.hide();
    },

    _createIcon: function(style)
    {
        var icon = document.createElement("i");
        icon.className += style;

        return icon;
    },

    //initialises current element
    //creates inner elements.
    initialise: function()
    {
        var newItem = $("#controls-schemes .playlist-item");
        this._item = newItem.clone();
        this._item.find(this._config.AdditionalButtonsContainer).hide();

        this._cover = this._item.find(this._config.CoverContainer);
    },

    //add styles to current element and its inner elements.
    setUpStyles: function(style)
    {
        this._item.addClass(style);
    },

    //fills element body with media details information.
    fillBody: function(mediaDetails)
    {
        this._item.find(this._config.TimeContainer).append(mediaDetails.duration.getHumanReadable());
        var details = mediaDetails.artist.name + " - " + mediaDetails.title;

        var titleContent = "Debug details:"+
            "\n\nArtist_name: "+mediaDetails.artist.name+
            "\nArtist_mbid: "+mediaDetails.artist.mbid+
            "\nArtist_url: "+mediaDetails.artist.url+
            "\n\nTitle: "+mediaDetails.title+
            "\nDuration: "+mediaDetails.duration.getHumanReadable()+
            "\nUrl: "+mediaDetails.url+
            "\nMediaType: "+mediaDetails.mediaType+
            "\nID: "+mediaDetails.id+
            "\nmbid: "+mediaDetails.mbid+
            "\n\nAlbum_name: "+mediaDetails.album.name+
            "\nAlbum_mbid: "+mediaDetails.album.mbid+
            "\nAlbum_url: "+mediaDetails.album.url+
            "\nAlbum_cover: "+mediaDetails.album.cover+
            "\n\nTags: "+mediaDetails.tags+
            "\nLove: "+mediaDetails.loved;
        this._item.attr("title", titleContent);

        this._cover.attr("src", mediaDetails.album.cover);

        //show item index (+1 to avoid index=0)
        this._item.find(this._config.IndexStyle).append(this._index+1);

        if(mediaDetails.loved)
        {
            this._item.find(this._config.IconsContainer).append(this._createIcon("fa fa-heart"));
        }

        if(mediaDetails.mediaType == "video/youtube")
        {
            this._item.find(this._config.IconsContainer).append(this._createIcon("fa fa-youtube"));
        }
        this._item.find(this._config.DetailsContainer).append(details);

        this._createContextMenu();
    },

    //hooks up to UI events such as clock, mouse enter, mouse leave.
    hookUpToEvents: function(callbackContext, clickHandler)
    {
        var onMouseClick = function(context, handler, index)
        {
            return function handlePlaylistItemEvent(e)
            {
                e.stopPropagation();
                handler.call(context, index);
            };
        };

        this._item.click(onMouseClick(callbackContext, clickHandler, this._index));
    },

    //builds fully initialised playlist item.
    build: function()
    {
        return this._item;
    }
};