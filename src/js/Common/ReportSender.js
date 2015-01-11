//using
window.Common = window.Common || {};

window.Common.ReportSenderConstants =
{
    destinationEmail: "onlinescrobbler@gmail.com",
    emailScriptLocation: "php/EmailSender.php",
    errorTag: "[Error]",
    featureTag: "[FeatureRequest]",
    usageTag: "[Usage]",

    logsContainer: "logger-content"
};

ReportSender = function()
{
    ReportSender._instance = null;
};

ReportSender.getInstance = function()
{
    if(ReportSender._instance === null)
    {
        throw "Instance of ReportSender has not been set yet!";
    }

    return ReportSender._instance;
};

ReportSender.setInstance = function(instance)
{
    if(ReportSender._instance !== null)
    {
        throw "Instance of ReportSender has been already set!";
    }

    ReportSender._instance = instance;
};

window.Common.ReportSenderImpl = function(){};

window.Common.ReportSenderImpl.prototype =
{
    _handleError: function(message)
    {
        this.sendErrorReport(
            window.Common.ReportSenderConstants.destinationEmail,
            "Automatically generated report",
            message);
    },

    _handleApplicationClosed: function()
    {
        this.sendUsageReport(
            window.Common.ReportSenderConstants.destinationEmail,
            "Application closed report");
    },

    _getBrowser: function()
    {
        return navigator.appCodeName +" "+ navigator.appVersion;
    },

    _getOperatingSystem: function()
    {
        return navigator.platform;
    },

    _getUserAgent: function()
    {
        return navigator.userAgent;
    },

    _getLogs: function()
    {
        var logEntries = $("#"+window.Common.ReportSenderConstants.logsContainer).children();
        var logs = "";

        for(var i=0;i<logEntries.length;i++)
        {
            logs += logEntries[i].innerHTML + "<br>";
        }

        return logs;
    },

    _generateErrorReportContent: function(sender, description)
    {
        return (
            "<font face=\"Courier New\">" +
                "<h2>Test report from: "+sender+"</h2>" +
                    "<h4>Environment details:</h4>" +
                    "<ul>" +
                        "<li>OS: "+this._getOperatingSystem()+"</li>"+
                        "<li>Browser: "+this._getBrowser()+"</li>"+
                        "<li>User Agent: "+this._getUserAgent()+"</li>"+
                    "</ul>" +
                    "<h4>Error description:</h4>"+
                    description +
                    "<h4>Logs:</h4>"+
                    this._getLogs()+
            "</font>");
    },

    _generateUsageReport: function()
    {
        return (
            "<font face=\"Courier New\">" +
                "<h4>Environment details:</h4>" +
                "<ul>" +
                "<li>OS: "+this._getOperatingSystem()+"</li>"+
                "<li>Browser: "+this._getBrowser()+"</li>"+
                "<li>User Agent: "+this._getUserAgent()+"</li>"+
                "</ul>" +
                "<h4>Logs:</h4>"+
                this._getLogs()+
                "</font>");
    },

    sendErrorReport: function(sender, title, description, callbacks)
    {
        callbacks = callbacks || {
            success: function()
            {
                Logger.getInstance().debug("Error report has been sent.");
            },
            fail: function()
            {
                Logger.getInstance().debug("Error occurs while sending error report.");
            }
        };

        title = window.Common.ReportSenderConstants.errorTag+" "+title;
        var content = this._generateErrorReportContent(sender, description);

        $.post(window.Common.ReportSenderConstants.emailScriptLocation,
            {
                recipient: window.Common.ReportSenderConstants.destinationEmail,
                sender: sender,
                subject: title,
                content: content
            })
            .fail(callbacks.fail)
            .done(callbacks.success);
    },

    sendFeatureRequest: function(sender, title, description, callbacks)
    {
        callbacks = callbacks || {
            success: function()
            {
                Logger.getInstance().debug("Feature request has been sent.");
            },
            fail: function()
            {
                Logger.getInstance().debug("Error occurs while sending feature request.");
            }
        };

        title = window.Common.ReportSenderConstants.featureTag+" "+title;

        $.post(window.Common.ReportSenderConstants.emailScriptLocation,
            {
                recipient: window.Common.ReportSenderConstants.destinationEmail,
                sender: sender,
                subject: title,
                content: description
            })
            .fail(callbacks.fail)
            .done(callbacks.success);
    },

    sendUsageReport: function(sender, title, callbacks)
    {
        callbacks = callbacks || {
            success: function()
            {
                Logger.getInstance().debug("Usage report has been sent.");
            },
            fail: function()
            {
                Logger.getInstance().debug("Error occurs while sending usage report.");
            }
        };

        title = window.Common.ReportSenderConstants.usageTag+" "+title;
        var content = this._generateUsageReport();

        $.ajax({
            type: "POST",
            url: window.Common.ReportSenderConstants.emailScriptLocation,
            data: {
                recipient: window.Common.ReportSenderConstants.destinationEmail,
                sender: sender,
                subject: title,
                content: content
            },
            async: false

            })
            .fail(callbacks.fail)
            .done(callbacks.success);
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.Common.LoggerEvents.LoggerError, this._handleError, null, this);
        //TODO: it is for development purposes only
        EventBroker.getInstance().addListener(window.Common.ApplicationEvents.ApplicationClosed, this._handleApplicationClosed, null, this);
    }
};