window.UI.ColorSchemeControlViewController = function(config)
{
    this.config = config;
};

window.UI.ColorSchemeControlViewController.prototype =
{
    _useDarkColorStyle: function _useDarkColorStyle()
    {
        this._hideAllButtons();
        this._showButton(this.config.LightSchemeButton);
        this._changeColorStyle(this.config.DarkStyle);
    },

    _useLightColorStyle: function _useLightColorStyle()
    {
        this._hideAllButtons();
        this._showButton(this.config.DarkSchemeButton);
        this._changeColorStyle(this.config.LightStyle);
    },

    _hideAllButtons: function _hideAllButtons()
    {
        $(this.config.LightSchemeButton).hide();
        $(this.config.DarkSchemeButton).hide();
    },

    _showButton: function _showButton(button)
    {
        $(button).show();
    },

    _changeColorStyle: function _changeColorStyle(newStyle)
    {
        //TODO change hardcoded value - it is an index of color.css link
        var oldlink = document.getElementsByTagName("link").item(3);

        var newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", newStyle);

        var a = document.getElementsByTagName("head").item(0);
        a.replaceChild(newlink, oldlink);
    },

    initialise: function initialise()
    {
        $(this.config.LightSchemeButton).click($.proxy(this._useLightColorStyle, this));
        $(this.config.DarkSchemeButton).click($.proxy(this._useDarkColorStyle, this));

        this._hideAllButtons();
        this._showButton(this.config.LightSchemeButton);
    }
};