/**
 * Only one request at  time.
 * Every period fo time look if a request should be send.
 */
function RequestManager(sendRequestToServerCallBack) {

	var optionsTimeLauncher={
			functionToCall : this._functionToCall,
			functionShoulBeCalled : this._functionShoulBeCalled,
			contextThis : this,
			repeat : true,
			reloadTime : CONFIG_FREIZE_MAP.TIME_RESET_SERVER_CALL_MS	
		};
	this.timeLauncher = new TimeLauncher(optionsTimeLauncher),
	
	this.uiLastRequest = null,
	this.lastSendingRequest = null,
	this.sendRequestToServerCallBack = sendRequestToServerCallBack;
	

};

RequestManager.prototype = {
	/*
	 * User change have been changed the area or time. 
	 * This request is save to be send later on start or later when no HTTP request running
	 */
	launch : function(uiRequest) {
		this.lastUIRequest = uiRequest;
		this.timeLauncher.launch();
	},

	
	/*return true if the param request id is the current request send to the server*/
	_isLastCallrequestID : function(idRequest) {
		return this.currentServerRequest!=null && this.currentServerRequest.id === idRequest;
	},

	//use by Timer
	_functionToCall : function(){
		this.lastSendingRequest = this.lastUIRequest;
		this.sendRequestToServerCallBack(this.lastUIRequest);
	},
	//use by Timer
	_functionShoulBeCalled : function(){
		var launch = false;
		if(!!this.lastUIRequest && !this._isLastCallrequestID(this.lastUIRequest.id)){
			launch = true;
		}
		return launch;
	}

};