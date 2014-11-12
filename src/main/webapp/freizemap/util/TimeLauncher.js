/**
 * Only one request to call 'options.functionToCall' during the time ('options.reloadTime'). 
 * options.repeat === true repeat always. 
 * The function options.functionToCall call at max options.reloadTime.
 * The function options.functionShoulBeCalled can be 'undefined' to have no effect.
 */
function TimeLauncher(options) {	
	this.functionToCall = options.functionToCall;
	this.functionShoulBeCalled = options.functionShoulBeCalled;
	this.contextCallerThis = options.contextThis;	
	this.repeat = options.repeat,
	this.reloadTime = options.reloadTime,
	this.isDuringInterval = false;
	this.relaunch = false;
	this.timerInterval = null;
	
	if (this.repeat === true) {
		var me = this;
		this.timerInterval = window.setInterval(function() {
			me.isDuringInterval = false;
			if(me.relaunch === true){
				me.relaunch = false;
				me._executeFunction();
			}
		}, me.reloadTime);
	}
};

TimeLauncher.prototype = {
	launch : function() {
		var me = this;
		
		if(me.isDuringInterval === true){
			//must wait
			me.relaunch = true;
			return;
		}		
		me.isDuringInterval = true;
		me._executeFunction();
		
		if (this.repeat === false) {			
			window.setTimeout(function() {
				me.isDuringInterval = false;
				if(me.relaunch === true){
					me.relaunch = false;
					me._executeFunction();					
				}
			}, me.reloadTime);
		}
	},
	_executeFunction : function() {
		
		if(this.functionShoulBeCalled === 'undefined' || this.functionShoulBeCalled.call(this.contextCallerThis)===true){
			
			this.functionToCall.call(this.contextCallerThis);
		}			
	},
	
	deleteTimer: function(){
		if(this.timerInterval !== null){
			window.clearInterval(this.timerInterval);
		}	
	}

};
