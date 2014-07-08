
function SynchroneEventHandler(typesOfEvent){
    this.listeners = {};
    for (var i=0, len=typesOfEvent.length; i < len; i++){      
        this.listeners[typesOfEvent[i]]=new Array();
    }
}

SynchroneEventHandler.prototype = {

	checkTypeDefined : function (type){
		if (!this.listeners[type] instanceof Array){
			throw new Error("The type is not defined. Use add Listener with this type");
		}	
	},
		
    
    addListener: function(type, listener){
    	
    	if($.isFunction(listener)===false){
    		throw new Error("listener is a function to call");
    	}
    	
    	this.checkTypeDefined(type);
    	if (typeof this.listeners[type] == "undefined" || this.listeners[type]==null){
            this.listeners[type] = [];
        }

        this.listeners[type].push(listener);
    },

    fire: function(event,dataEvent){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }
        
        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }
        this.checkTypeDefined(event.type);
        if (this.listeners[event.type] instanceof Array){
            var listeners = this.listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, dataEvent);
            }
        }
    },

    removeListener: function(type, listener){
    	this.checkTypeDefined(event.type);
    	
        if (this.listeners[type] instanceof Array){
            var listeners = this.listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};