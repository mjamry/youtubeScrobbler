window.UI.ColorSchemeControlViewController = function(config)
{
    this.config = config;
    this.currentTheme = this.config.DarkStyle;
};

window.UI.ColorSchemeControlViewController.prototype =
{
    _useDarkColorStyle: function _useDarkColorStyle()
    {
        this.currentTheme = this.config.DarkStyle;
        this._changeColorStyle(this.currentTheme);
    },

    _useLightColorStyle: function _useLightColorStyle()
    {
        this.currentTheme = this.config.LightStyle;
        this._changeColorStyle(this.currentTheme);
    },

    _switchTheme: function _switchTheme()
    {
        if(this.currentTheme === this.config.DarkStyle)
        {
            this._useLightColorStyle();
        }
        else
        {
            this._useDarkColorStyle();
        }
    },

    _changeColorStyle: function _changeColorStyle(newStyle)
    {
        //TODO change hardcoded value - it is an index of color.css link
        var oldlink = document.getElementsByTagName("link").item(4);

        var newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", newStyle);

        var a = document.getElementsByTagName("head").item(0);
        a.replaceChild(newlink, oldlink);
    },

    initialise: function initialise()
    {
        $(this.config.ThemeSwitchButton).click($.proxy(this._switchTheme, this));
    }
};