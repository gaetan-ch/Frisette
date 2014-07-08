


/**
 * Manage the model of the application. TODO 06-04-2014 From here fire event to
 * observer(map and frise) fro updating...
 */
function ModelMarkers() {
	// single event define by one time and one postion
	this.markersTimePosition = new Array();
	
	// marker for multiple event, so a event's population
	this.markersPopulation = new Array();
	
	this.eventsType = ['ADD_MARKERS_EVENT','REMOVE_MARKERS_EVENT'];
	
	this.synchroneEventHandler = new SynchroneEventHandler(this.eventsType);
	
};

/*
 * called to initialize google map.
 * 
 */
ModelMarkers.prototype = {
	
	onMarkersAdded : function(functionOnAdd) {		
		this.synchroneEventHandler.addListener('ADD_MARKERS_EVENT', functionOnAdd);
	},		
	onMarkersRemoved : function(functionOneRemove) {		
		this.synchroneEventHandler.addListener('REMOVE_MARKERS_EVENT', functionOneRemove);
	},	
		
	getMarkersTimePosition : function() {
		return this.markersTimePosition;
	},
	
	getMarkersPopulation : function() {
		return this.markersPopulation;
	},
	
	/**
	 * Transform events from server to markers (our model)
	 * 
	 * @param eventsfromServer
	 */
	setModel : function(dataFromServer) {
		var me = this, markersTimePositionToRemove= new Array(), markersTimePositionToAdd = new Array();
		
		//first: fire event for remove marker
		$.each(this.markersTimePosition, function(index, marker) {
			var found = false;
			$.each(dataFromServer.events, function(index, markerFromServer) {			
				if(marker.wikiID == markerFromServer.wikiID){
					found =true;
					return false;
				}
				return true;
			});
			if(found === false){
				//not exist anymore
				markersTimePositionToRemove.push(marker);
			}
		});
		
		this.markersTimePosition = new Array();		
		this.markersPopulation = new Array();
		
		$.each(dataFromServer.events, function(index, eventToDisplay) {
			me.markersTimePosition[index] = new Marker(eventToDisplay.wikiID, eventToDisplay.nameSurname,
				eventToDisplay.timestamp, eventToDisplay.birthPlaceURI,'',
				eventToDisplay.longitude, eventToDisplay.latitude);
			markersTimePositionToAdd.push(me.markersTimePosition[index]);
		});
		
		$.each(dataFromServer.populationEvents, function(index, eventToDisplay) {
			me.markersPopulation[index] = new MarkerPopulation(eventToDisplay.wikiID, eventToDisplay.nameSurname,
						eventToDisplay.timestamp, eventToDisplay.birthPlaceURI,'',
						eventToDisplay.longitude, eventToDisplay.latitude,eventToDisplay.population);			
		});
		
		if(markersTimePositionToRemove.length>0){
			me.synchroneEventHandler.fire('REMOVE_MARKERS_EVENT',markersTimePositionToRemove);
		}
		if(markersTimePositionToAdd.length>0){
			//TODO gaetan wrong because put element already added
			me.synchroneEventHandler.fire('ADD_MARKERS_EVENT',markersTimePositionToAdd);
		}
	},
	
	getMarkerTimePositionFromId : function(id) {
		var marker = null;
		$.each(this.markersTimePosition, function(index, markerIt) {			
			if(markerIt.wikiID == id){
				marker = markerIt;
				return false; //stop the iteration
			}
		});
		return marker;
	}
	

};