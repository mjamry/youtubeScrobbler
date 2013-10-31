//namespace
window.Common = window.Common || {};

//singleton pattern for event broaker
window.Common.EventBrokerSingleton = function()
{
    this._instance = null;
};

window.Common.EventBrokerSingleton.setInstance = function(instance)
{
    //TODO maybe better validation here or just lazy loading instead.
    if(this._instance == null)
    {
        this._instance = instance;
        window.Common.Log.Instance().Info("Events broker instance has been set.");
    }
};

window.Common.EventBrokerSingleton.instance = function()
{
    return this._instance;
};

//Provides possibility to register listeners for specified event.
window.Common.EventBroker = function()
{
    this.listeners = {};
    window.Common.Log.Instance().Info("Event broker has been created.");
};

window.Common.EventBroker.prototype =
{
    //Adds new listener for specified event.
    addListener: function(event, listener, data, context)
    {
        var innerContext = context || null;
        if( !this.listeners[event] )
        {
            this.listeners[event] = [];
        }

        this.listeners[event].push(
            {
                method: listener,
                args: data,
                context: innerContext
            }
        );
    },
            
    removeListener: function(event, listener)
    {
        var eventListeners = this.listeners[event];
        for(var i = 0;i<eventListeners.length;i++)
        {
            if(eventListeners[i].method === listener)
            {
                eventListeners.splice(i, 1);
            }
        }
    },
            
    fireEvent: function(event)
    {
        if(this.listeners[event])
        {
            //window.Common.Log.Instance().Debug("Event: "+event+" has been fired");

            for(var i = 0;i<this.listeners[event].length;i++)
            {
                var listener = this.listeners[event][i];
                listener.method.call(listener.context);
            }
        }
        else
        {
            //window.Common.Log.Instance().Debug("Event: "+event+" hasn't got any listeners.");
        }
    },
    
    fireEventWithData: function(event, data)
    {
        if(this.listeners[event])
        {
           // window.Common.Log.Instance().Debug("Event: "+event+" has been fired, data: "+data);

            for(var i = 0;i<this.listeners[event].length;i++)
            {
                var listener = this.listeners[event][i];
                listener.method.call(listener.context, data);
            }
        }
        else
        {
            //window.Common.Log.Instance().Debug("Event: "+event+" hasn't got any listeners.");
        }
    }
};