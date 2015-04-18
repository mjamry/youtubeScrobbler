//namespace
window.UI = window.UI || {};

window.UI.PlaylistItemDetailsEditorViewController = function(detailsProvider, playlistProvider, config)
{
    this.detailsProvider = detailsProvider;
    this.playlistProvider = playlistProvider;
    this.config = config;

    this.index = null;
    this.mediaDetails = null;
    this.view = $(this.config.Container);

    this.modalId = null;
};

window.UI.PlaylistItemDetailsEditorViewController.prototype =
{
    _setVerificationCorrectStatus: function(item)
    {
        var indicator = $(item);
        indicator.show();
        indicator.children(this.config.VerificationOk).show();
        indicator.children(this.config.VerificationError).hide();
    },

    _setVerificationErrorStatus: function(item)
    {
        var indicator = $(item);
        indicator.show();
        indicator.children(this.config.VerificationOk).hide();
        indicator.children(this.config.VerificationError).show();
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

    _swapArtistNameAndTitle: function(that)
    {
        that.mediaDetails = that._retrieveMediaDetails();
        var title = that.mediaDetails.title;
        that.mediaDetails.title = that.mediaDetails.artist.name;
        that.mediaDetails.artist.name = title;
        that.updateView();
    },

    _savePlaylistItemDetails: function(that)
    {
        var undoCallback = function(that, index)
        {
            var detailsToRestore = that.playlistProvider.getPlaylist().get(index).clone();
            return function undoTrackEdit()
            {
                that.playlistProvider.updateItem(index, detailsToRestore);
            };
        };

        that.mediaDetails = that._retrieveMediaDetails();
        UserNotifier.getInstance().info("Details saved for '"+that.mediaDetails.artist.name+" - "+that.mediaDetails.title+"'", undoCallback(this, this.index));
        Logger.getInstance().info("[Editor] Details saved for '"+that.mediaDetails.artist.name+" - "+that.mediaDetails.title+"'");
        that.playlistProvider.updateItem(that.index, that.mediaDetails);
        that._hide();
    },

    _validateEnteredData: function()
    {
        LoadingIndicatorService.getInstance().show({title: "Please wait.", content: "Verifying track details."});
        var mediaDetails = this._retrieveMediaDetails();
        this.detailsProvider.getTrackDetails(
            mediaDetails,
            {
                done: this._handleDetailsObtained(this),
                fail: function()
                {
                    LoadingIndicatorService.getInstance().hide();
                }
            }
        );
    },

    _show: function showPlaylistItemEditor(mediaDetails, index)
    {
        this.index = index;
        this.mediaDetails = mediaDetails;
    },

    _hide: function hidePlaylistItemEditor()
    {
        this._clearView();
        this.index = null;
        this.mediaDetails = null;

        ModalService.getInstance().close(this.modalId);
        this.modalId = null;
    },

    _clearView: function _clearView()
    {
        this._clearEnteredValues();
    },

    _clearEnteredValues: function()
    {
        //cleat inputs
        $(this.config.ArtistInput).val("");
        $(this.config.TitleInput).val("");
        $(this.config.AlbumInput).val("");

        //hide indicators
        $(this.config.ArtistVerification).hide();
        $(this.config.TitleVerification).hide();
        $(this.config.AlbumVerification).hide();
    },

    _onItemEditionRequested: function(args)
    {
        this.view = $("#controls-schemes "+this.config.Container).clone();
        this._hookUpButtonsActions();
        this._show(args.mediaDetails, args.index);
        this.updateView();

        this.modalId = ModalService.getInstance().show({content: this.view, canClose: true});
    },

    _handleDetailsObtained: function(that)
    {
        return function _handleDetailsObtained(mediaDetails)
        {
            that.mediaDetails = mediaDetails.clone();
            that.updateView();
            LoadingIndicatorService.getInstance().hide();
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

    _hookUpButtonsActions: function()
    {
        this.view.find(this.config.SwapButton).click($.proxy(function swapItemDetails(e)
            {
                e.preventDefault();
                this._swapArtistNameAndTitle(this);
            },
            this));

        this.view.find(this.config.SaveButton).click($.proxy(function saveEditedItem(e)
            {
                e.preventDefault();
                this._savePlaylistItemDetails(this);
            },
            this));

        this.view.find(this.config.CheckButton).click($.proxy(function(e)
            {
                e.preventDefault();
                this._validateEnteredData().bind(this);
            },
            this));

        this.view.find(this.config.CloseButton).click($.proxy(function closePlaylistItemEditor(e)
            {
                e.preventDefault();
                this._hide();
            },
            this));
    },

    //updated view with current media details
    updateView: function updateView()
    {
        this._clearEnteredValues();
        if(this.mediaDetails.artist.name)
        {
            this.view.find(this.config.ArtistInput).val(this.mediaDetails.artist.name);
        }

        if(this.mediaDetails.title)
        {
            this.view.find(this.config.TitleInput).val(this.mediaDetails.title);
        }

        if(this.mediaDetails.album.name)
        {
            this.view.find(this.config.AlbumInput).val(this.mediaDetails.album.name);
        }

        this._verifyItems();
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Player.PlaylistEvents.PlaylistItemEditionRequested, $.proxy(this._onItemEditionRequested, this));
    }
};