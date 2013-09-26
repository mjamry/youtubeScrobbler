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
    }
}

window.Common.EventBrokerSingleton.instance = function()
{
    return this._instance;
}

//Provides possibility to register listeners for specified event.
window.Common.EventBroker = function(events)
{
    this.listeners = [];

    this.initialise(events);
}

window.Common.EventBroker.prototype =
{
    //initialises listeners array with empty values.
    initialise: function(events)
    {
        //creates empty listeners list
        for(var key in events)
        {
            if(events.hasOwnProperty(key)){
                var e = events[key];
                this.listeners[e] = [];
            }
        }
    },

    //Adds new listener for specified event.
    addListener: function(event, listener, data, context)
    {
        var innerContext = context || null;
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
        var eventListeners = this.listeners[event];
        for(var i = 0;i<eventListeners.length;i++)
        {
            var listener = eventListeners[i];
            listener.method(listener.args);
        }

        window.Common.Log.Instance().Debug("Event: "+event+" has been fired");
    },
    
    fireEventWithData: function(event, data)
    {
        var eventListeners = this.listeners[event];
        for(var i = 0;i<eventListeners.length;i++)
        {
            var listener = eventListeners[i];
            listener.method(data, listener.args);
        }

        window.Common.Log.Instance().Debug("Event: "+event+" has been fired, data: "+data);
    }
};