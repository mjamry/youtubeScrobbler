//using
window.UI = window.UI || {};

window.UI.ReportSender = function(){};

window.UI.ReportSender.prototype =
{
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

    send: function(sender, title, description)
    {
        var logsContainer = "logger-content";
        var logEntries = $("#"+logsContainer).children();
        var logs = "";

        title = "[Error] "+title;

        for(var i=0;i<logEntries.length;i++)
        {
            logs += logEntries[i].innerHTML + "<br>";
        }

        var content =
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
            logs;


        $.post("php/EmailSender.php",
            {
                recipient: "onlinescrobbler@gmail.com",
                sender: sender,
                subject: title,
                content: content
            }).fail(function(){
                alert("error report error :(");
            }).done(function(){
                alert("error reported!")
            })
    }
};