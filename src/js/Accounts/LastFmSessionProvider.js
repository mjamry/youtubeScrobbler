//namespace
window.LastFm = window.LastFm || {};

//using
window.Common = window.Common || {};

//Handles sessions on last.fm portal.
window.LastFm.LastFmSessionProvider = function(lastFmApi)
{
    this.lastFmApi = lastFmApi;
    Logger.getInstance().info("Last fm session handler has been created.");
};

window.LastFm.LastFmSessionProvider.prototype =
{
    create: function(token, callbacks)
    {
        Logger.getInstance().debug("Last fm - new session requested using token: " + token);
        this.lastFmApi.auth.getSession({token:token},
            {
                success: $.proxy(function(response)
                {
                    //Response structure:
                    //<session>
                    //  <name>MyLastFMUsername</name>
                    //  <key>d580d57f32848f5dcf574d1ce18d78b2</key>
                    //  <subscriber>0</subscriber>
                    //</session>
                    callbacks.success(response.session);
                }, this),

                error: $.proxy(function(err, msg)
                {
                    Logger.getInstance().warning("Cannot establish session: " + msg);

                    callbacks.error();
                }, this)
            });
    }
};
