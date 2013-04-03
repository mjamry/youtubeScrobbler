function eventHandler(events)
{
    this.events = events;
    this.listeners = [];
    
    for(var key in this.events)
    {
        var e = this.events[key];
        this.listeners[e] = [];
    }
}

eventHandler.prototype = 
{
    addListener: function(event, listener, data, context)
    {
        var c = context || null;
        this.listeners[event].push(
            {
                method: listener,
                args: data,
                context: context
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