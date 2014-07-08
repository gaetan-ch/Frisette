/*
 * Controler of the map and the freize
 * 
 */

function FreizeMapControler() {
	this.wrapperMap = new WrapperMap();
	this.wrapperFreize = new WrapperFreize();
	this.resourcesWindowControler = new ResourcesWindowControler();
	this.remoteServer = new RemoteServer();
	this.requestManager = new RequestManager(this.sendRequestToServerCallBack);
	this.model = new ModelMarkers();
};
FreizeMapControler.prototype = {
	initialize : function() {

		this.wrapperMap.initialize();

		this.wrapperFreize.initialize();
		
		this._initListener();

	},
	
	_initListener : function(){
		var me = this;
		// Suscribe to map event
		$(document).on(
				CONFIG_FREIZE_MAP.MAP_CHANGE_BOUND_EVENT_TYPE,
				{
					me : this
				},
				function(e) { 
					console.info('map move');
					var boundTime = e.data.me.wrapperFreize.getBoundTime();
					e.data.me._onBoundsChange(e.type,e.bounds,boundTime);
					e.data.me.resourcesWindowControler.deleteAllWindow();
				}			
		);
		// Suscribe to frize event
		$(document).on(
				CONFIG_FREIZE_MAP.TIME_CHANGE_BOUND_EVENT_TYPE,
				{
					me : this
				},
				function(e) {					
					e.data.me._onBoundsChange(e.type,e.data.me.wrapperMap.getAreaBounds(),e.boundTime);
					e.data.me.resourcesWindowControler.deleteAllWindow();
				}
		);
		// Suscribe to frize event
		$(document).on(
				CONFIG_FREIZE_MAP.MAP_RESIZE_PANEL_HEIGHT_EVENT_TYPE,
				{
					me : this
				},
				function(e) {
					//e.heightPercent
					$('#frisePanel').height((100 - e.heightPercent)+'%');
				}
		);
		
		$(document).on(
				CONFIG_FREIZE_MAP.CLICK_MARKER_FRIZE_EVENT_TYPE,
				{
					me : this
				},
				function(e) {
					
					if(e.marker==null){
						e.marker = e.data.me.model.getMarkerTimePositionFromId(e.idMarker);
					}
					var mapPosition = e.data.me.wrapperMap.getAbsoluteMarkerUIPositionFromId(e.idMarker);
					
					e.data.me.resourcesWindowControler.addWindow(e.marker,mapPosition/*map position*/, e.position/*frise position*/);
				}
							
		);
		
		$(document).on(
				CONFIG_FREIZE_MAP.CLICK_MARKER_MAP_EVENT_TYPE,
				{
					me : this
				},
				function(e) {
					var frizePosition = e.data.me.wrapperFreize.getAbsoluteMarkerUIPositionFromId(e.idMarker);
					if(e.data.me.resourcesWindowControler.isMarkerPresent(e.idMarker)){
						e.data.me.resourcesWindowControler.selectWindow(e.marker, e.position/*map position*/, frizePosition/*frise position*/);						
					}else{
						e.data.me.resourcesWindowControler.addWindow(e.marker, e.position/*map position*/, frizePosition/*frise position*/);
					}
				}
							
		);
		
		this.model.onMarkersAdded(
				function(markers){
					console.info('Nbr markers added>>' + markers.length);
				}
		);
		this.model.onMarkersRemoved(
				function(markers){
					console.info('Nbr markers remove>>' + markers.length);
					//me.resourcesWindowControler.removeMarkers(markers);
				}
		);
	},
	
	sendRequestToServerCallBack: function(requestToServer){
		//bind this to the method
		var me = freizeMapControler;		
		console.info('Req is sending' + requestToServer.id);
		me.remoteServer.loadMarkers(
				requestToServer, function(dataFromServer) {
					me._onMarkersFromServer(dataFromServer);
					//else we don't display an old request (not the last)
				});
	},
	
	_onBoundsChange : function(typeEvent, boundsArea, boundTime){
		console.info('something move');
				
		var requestToServer = new RequestToServer(typeEvent,boundsArea,boundTime);
		this.requestManager.launch(requestToServer);
		
	},
	
	/*Data comes from the server to display*/
	_onMarkersFromServer : function(dataFromServer) {
		
		//each time we erase the last model
		this.model.setModel(dataFromServer);
		// should be do on the server
		var markersTimePosition = this.model.getMarkersTimePosition();
		var markersPopulation = this.model.getMarkersPopulation();

		this.wrapperMap.drawMarkers(markersTimePosition,markersPopulation);
				
		//update the scale and postion Freize only if the event comes from the MAP
		var updateScaleFreize = dataFromServer.originaleRequestToServer.originEvent === CONFIG_FREIZE_MAP.MAP_CHANGE_BOUND_EVENT_TYPE;
				
		this.wrapperFreize.drawMarkers(markersTimePosition,updateScaleFreize);
	}

};
