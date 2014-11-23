//namespace
window.Accounts = window.Accounts || {};

//Handles sessions on last.fm portal.
window.Accounts.LastFmSessionProvider = function()
{
    Logger.getInstance().info("[LastFm] Session provider has been created.");
    this._session = null;
};

window.Accounts.LastFmSessionProvider.prototype =
{
    //<session>
    //    <name>MyLastFMUsername</name>
    //    <key>d580d57f32848f5dcf574d1ce18d78b2</key>
    //    <subscriber>0</subscriber>
    //</session>
    _handleNewSessionCreated: function(that)
    {
        return function onNewSessionCreated(sessionDetails)
        {
            Logger.getInstance().info("[LastFm] Session for user: "+sessionDetails.name+" has been created.");
            that._session = sessionDetails;
        }
    },

    isSessionCreated: function()
    {
        return this._session !== null;
    },

    getSession: function()
    {
        if(this.isSessionCreated())
        {
            return this._session;
        }
        else
        {
            //return empty session object
            return {
                name: "",
                key: "",
                subscriber: 0
            }
        }
    },

    initialise: function()
    {
        EventBroker.getInstance().addListener(window.LastFm.Events.SessionObjectCreated, this._handleNewSessionCreated(this))
    }
};
