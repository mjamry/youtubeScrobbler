//namespace
window.UI = window.UI || {};

window.UI.PlaylistItemDetailsEditorViewController = function(detailsProvider, playlistProvider, config)
{
    this.detailsProvider = detailsProvider;
    this.playlistProvider = playlistProvider;
    this.config = config;

    this.index = null;
    this.mediaDetails = null;
};

window.UI.PlaylistItemDetailsEditorViewController.prototype =
{
    _setVerificationCorrectStatus: function(item)
    {
        $(item).children(this.config.VerificationOk).show();
        $(item).children(this.config.VerificationError).hide();
    },

    _setVerificationErrorStatus: function(item)
    {
        $(item).children(this.config.VerificationOk).hide();
        $(item).children(this.config.VerificationError).show();
    },

    _verifyItems: function()
    {
        this._setVerificationErrorStatus(this.config.ArtistVerification);
        this._setVerificationErrorStatus(this.config.TitleVerification);
        this._setVerificationErrorStatus(this.config.AlbumVerification);

        if(this.mediaDetails.artist.mbid)
        {
            this._setVerificationCorrectStatus(this.config.ArtistVerification);
        }

        if(this.mediaDetails.mbid)
        {
            this._setVerificationCorrectStatus(this.config.TitleVerification);
        }

        if(this.mediaDetails.album.mbid)
        {
            this._setVerificationCorrectStatus(this.config.AlbumVerification);
        }
    },

    _onItemEditionRequested: function(args)
    {
        this._show(args.mediaDetails, args.index);
        this.updateView();
    },

    _handleDetailsObtained: function(that)
    {
        return function _handleDetailsObtained(mediaDetails)
        {
            that.mediaDetails = mediaDetails.clone();
            that.updateView();
        };
    },

    _retrieveMediaDetails: function()
    {
        var mediaDetails = this.mediaDetails.clone();
        mediaDetails.artist.name = $(this.config.ArtistInput).val();
        mediaDetails.title = $(this.config.TitleInput).val();
        mediaDetails.album.name = $(this.config.AlbumInput).val();

        return mediaDetails;
    },

    _swapArtistNameAndTitle: function(that)
    {
        that.mediaDetails = that._retrieveMediaDetails();
        var title = that.mediaDetails.title;
        that.mediaDetails.title = that.mediaDetails.artist.name;
        that.mediaDetails.artist.name = title;
        that.updateView();
    },

    _savePlaylistItemDetails: function _saveEditedPlaylistItem(that)
    {
        that.mediaDetails = that._retrieveMediaDetails();
        that.playlistProvider.updateItem(that.index, that.mediaDetails);
        UserNotifier.getInstance().info("Details saved for "+that.mediaDetails.artist.name+" - "+that.mediaDetails.title);
        that._hide();
    },

    _hide: function hidePlaylistItemEditor()
    {
        this._clearView();
        $(this.config.Container).hide();
        this.index = null;
        this.mediaDetails = null;
    },

    _clearView: function _clearView()
    {
        $(this.config.ArtistInput).val("");
        $(this.config.TitleInput).val("");
        $(this.config.AlbumInput).val("");
    },

    //updated view with current media details
    updateView: function updateView()
    {
        this._clearView();
        if(this.mediaDetails.artist.name)
        {
            $(this.config.ArtistInput).val(this.mediaDetails.artist.name);
        }

        if(this.mediaDetails.title)
        {
            $(this.config.TitleInput).val(this.mediaDetails.title);
        }

        if(this.mediaDetails.album.name)
        {
            $(this.config.AlbumInput).val(this.mediaDetails.album.name);
        }

        this._verifyItems();
    },

    _show: function showPlaylistItemEditor(mediaDetails, index)
    {
        this.index = index;
        this.mediaDetails = mediaDetails;
        $(this.config.Container).show();
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemEditionRequested, $.proxy(this._onItemEditionRequested, this));

        $(this.config.SwapButton).click($.proxy(function swapItemDetails(e)
        {
            e.preventDefault();
            this._swapArtistNameAndTitle(this);
        },
        this));

        $(this.config.SaveButton).click($.proxy(function saveEditedItem(e)
        {
            e.preventDefault();
            this._savePlaylistItemDetails(this);
        },
        this));

        $(this.config.CheckButton).click($.proxy(function(e)
        {
            e.preventDefault();

            var mediaDetails = this._retrieveMediaDetails();
            this.detailsProvider.getTrackDetails(
                mediaDetails,
                {user:""},
                {
                    done: this._handleDetailsObtained(this),
                    fail: function(){}
                }
            );
        },
        this));

        $(this.config.CloseButton).click($.proxy(function closePlaylistItemEditor(e)
        {
            e.preventDefault();
            this._hide();
        },
        this));
    }
};