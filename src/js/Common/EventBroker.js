//namespace
window.Common = window.Common || {};

EventBroker = function()
{
    EventBroker._instance = null;
};

EventBroker.setInstance = function(instance)
{
    if(EventBroker._instance !== null)
    {
        var errorMsg = "Instance of EventBroker has been already set!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    EventBroker._instance = instance;
};

EventBroker.getInstance = function()
{
    if(EventBroker._instance === null)
    {
        var errorMsg = "Instance of EventBroker has not been set yet!";
        Logger.getInstance().error(errorMsg);
        throw errorMsg;
    }

    return EventBroker._instance;
};

//Provides possibility to register listeners for specified event.
window.Common.EventBrokerImpl = function()
{
    this.listeners = {};
    Logger.getInstance().info("Event broker has been created.");
};

window.Common.EventBrokerImpl.prototype =
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
            for(var i = 0;i<this.listeners[event].length;i++)
            {
                var listener = this.listeners[event][i];
                listener.method.call(listener.context);
            }
        }
    },
    
    fireEventWithData: function(event, data)
    {
        if(this.listeners[event])
        {
            for(var i = 0;i<this.listeners[event].length;i++)
            {
                var listener = this.listeners[event][i];
                listener.method.call(listener.context, data);
            }
        }
    }
};