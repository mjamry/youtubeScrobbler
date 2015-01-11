//using
window.UI = window.UI || {};

window.UI.PlaylistUIItemBuilder = function(index, config)
{
    this._eventBroker = EventBroker.getInstance();

    this._index = index;
    this._config = config;
    this._item = null;
    this._removeButton = null;
    this._hoverStyle = null;
    this._cover = null;
};

window.UI.PlaylistUIItemBuilder.prototype =
{
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
    },

    //hooks up to UI events such as clock, mouse enter, mouse leave.
    hookUpToEvents: function(callbackContext, clickHandler)
    {
        //event handler
        var handleEvent = function(context, handler, index)
        {
            function handlePlaylistItemEvent(e)
            {
                e.stopPropagation();
                handler.call(context, index);
            }
            return handlePlaylistItemEvent;
        };

        var onClickHandler = handleEvent(callbackContext, clickHandler, this._index);
        this._item.click(onClickHandler);
    },

    //builds fully initialised playlist item.
    build: function()
    {
        return this._item;
    }
};