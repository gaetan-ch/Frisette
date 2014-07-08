/**
 * Only one request to call 'options.caller.functionToCall' during the time
 * ('options.reloadTime'). options.repeat ===true repeat always. Before call
 * 'options.functionToCall' test if it is necessary tu call
 * 'options.caller.functionShoulBeSend'
 */
function TimeLauncher(options) {
	this.caller = options.caller,
	this.repeat = options.repeat,
	this.reloadTime = options.reloadTime,
	this.isDuringInterval = false;
	this.relaunch = false;
	
	if (this.repeat === true) {
		var me = this;
		window.setInterval(function() {
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
		
		if(this.caller._functionShoulBeCalled()===true){
			
			this.caller._functionToCall();
		}		
	}

};
