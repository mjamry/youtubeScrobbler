//namespace
window.UI = window.UI || {};

window.UI.LoggerLevels =
{
    Info: 0,
    Warning: 1,
    Error: 2,
    Debug: 3
};


window.UI.LoggerViewController = function(view, config)
{
    this._config = config;
    this._view = view;
};

window.UI.LoggerViewController.prototype =
{
    isLoggingAllowed: false,

    currentLoggerLevel: window.UI.LoggerLevels.Info,

    //removes all log entries
    _clearLogs: function()
    {
        this._view.empty();
    },

    //enables logger - new entries can be added
    _enableLogger: function()
    {
        this.isLoggingAllowed = true;
    },

    //disables logger
    _disableLogger: function()
    {
        this.isLoggingAllowed = false;
    },

    //returns style coresponding to current logger level
    _getStyleForLevel: function(level)
    {
        switch(level)
        {
            case window.UI.LoggerLevels.Info:
                return this._config.InfoStyle;
            case window.UI.LoggerLevels.Warning:
                return this._config.WarningStyle;
            case window.UI.LoggerLevels.Error:
                return this._config.ErrorStyle;
            case window.UI.LoggerLevels.Debug:
                return this._config.DebugStyle;
            default:
                return this._config.InfoStyle;
        }
    },

    //updates logger view. shows/hides entries according to its level
    _updateLoggerView: function(currentLevel)
    {
        this._view.children().each(function()
        {
            var level = this.getAttribute("level");
            if(level <= currentLevel)
            {
                this.style.display = "block";
            }
            else
            {
                this.style.display = "none";
            }
        });
    },

    //adds new log entry to logger view
    //also validates logger level and displays only appropriate logs.
    _handleLoggedMessage: function(message, level)
    {
        if(this.isLoggingAllowed)
        {
            var style = this._getStyleForLevel(level);

            var newLog = document.createElement(this._config.SingleElementType);
            newLog.className = style;
            newLog.innerHTML = message;
            newLog.setAttribute("level", level);

            if(this._view.children().length + 1 > this._config.MaxNumberOfLogs)
            {
                //remove first element if limit has been reached.
                this._view.find(this._config.SingleElementType+':last').remove();
            }

            this._view.prepend(newLog);

            if(level > this.currentLoggerLevel)
            {
                newLog.style.display = "none";
            }
        }
    },

    initialise: function()
    {
        var eventBroker = EventBroker.getInstance();

        eventBroker.addListener(window.Common.LoggerEvents.LoggedInfo,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, window.UI.LoggerLevels.Info);
            },
            this));

        eventBroker.addListener(window.Common.LoggerEvents.LoggerWarning,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, window.UI.LoggerLevels.Warning);
            },
            this));

        eventBroker.addListener(window.Common.LoggerEvents.LoggerError,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, window.UI.LoggerLevels.Error);
            },
            this));

        eventBroker.addListener(window.Common.LoggerEvents.LoggerDebug,
            $.proxy(function(message)
            {
                this._handleLoggedMessage(message, window.UI.LoggerLevels.Debug);
            },
            this));


        //attach to UI actions
        $(this._config.ClearLogsButtonId).bind("click", $.proxy(function()
        {
            this._clearLogs();
        },
        this));

        var checkbox = $(this._config.IsLoggerEnabledCheckboxId);
        checkbox.bind("change", $.proxy(function()
        {
            if(checkbox.prop("checked"))
            {
                this._enableLogger();
            }
            else
            {
                this._disableLogger();
            }
        },
        this));

        var comboBox =  $(this._config.LoggerLevelComboBox);
        comboBox.bind("change", $.proxy(function()
        {
            this.currentLoggerLevel = comboBox.val();
            this._updateLoggerView(this.currentLoggerLevel);
        },
        this));

    }
};