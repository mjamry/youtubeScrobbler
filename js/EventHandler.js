//namespace
window.Common = window.Common || {};

//Provides possibility to register listeners for specified event.
window.Common.EventHandler = function(events)
{
    this.events = events;
    this.listeners = [];

    //creates empty listeners list
    for(var key in this.events)
    {
        var e = this.events[key];
        this.listeners[e] = [];
    }
}

window.Common.EventHandler.prototype =
{
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
    },
    
    fireEventWithData: function(event, data)
    {
        var eventListeners = this.listeners[event];
        for(var i = 0;i<eventListeners.length;i++)
        {
            var listener = eventListeners[i];
            listener.method(data, listener.args);
        }
    }
};