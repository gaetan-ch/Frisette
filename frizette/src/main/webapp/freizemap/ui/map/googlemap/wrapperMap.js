//Google map\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function WrapperMap() {
	
	this.googleMap;
	//TODO delete this markers Array in order to use the model
	this.markers = new Array();
};

/*
 * called to initialize google map.
 * 
 */
WrapperMap.prototype = {
	initialize : function(mapPanel) {
		var mapPanel = document.getElementById("mapPanel");
		
		if(!this.testGoogleLoaded()){
			//google not loaded!!!!			
			return;
		}
		
		var mapOptions = {
			center : new google.maps.LatLng(45, 5),
			zoom : 6
		};
		
		var googleMapPanel = document.getElementById("googleMapPanel");
		this.googleMap = new google.maps.Map(googleMapPanel, mapOptions);
		var map = this.googleMap;
		
				
		// Evenements list:
		// https://developers.google.com/maps/documentation/javascript/reference?csw=1#Map
		google.maps.event.addListener(this.googleMap, 'idle', function() {		
			var bds = map.getBounds();
			$.event.trigger({
				type : CONFIG_FREIZE_MAP.MAP_CHANGE_BOUND_EVENT_TYPE,
				bounds : bds,
				time : new Date()
			});
		});
		return $(mapPanel);
	},
	
	getAreaBounds :  function (){
		if(!this.testGoogleLoaded()){
			//google not loaded!!!!			
			return null;
		}
		return this.googleMap.getBounds();
	},
	
	testGoogleLoaded : function (){
		var googleloaded;
		try{
			googleloaded = !!google;			
		}catch(e){
			googleloaded = false;
		}
		return googleloaded;
	},
		
	
	drawMarkers : function(newMarkerPosition, newMarkerPopulation) {
		
		if(!this.testGoogleLoaded()){
			//google not loaded!!!!			
			return;
		}
		
		//all noted to remove
		$.each(this.markers, function(index, marker) {
			marker.toRemove= true;			
		});
		
		me = this;
		var map = this.googleMap;
		
		$.each(newMarkerPosition, function(index, newWrapperMarker) {			
			var wrapperAlreadyDraw = me._getInWrapperList(newWrapperMarker.wikiID);			
			if(wrapperAlreadyDraw===null){				
				var markerMap = me._createMarkerMap(newWrapperMarker);				
				markerMap.addListener('click', function () {						
						me._onMouseClickMarker(this/*marker*/);					
				});
				markerMap.setMap(map);
				me.markers.push(markerMap);
				markerMap.toRemove= false;
			}else{
				wrapperAlreadyDraw.marker.toRemove= false;
			}
			
		});		
		//check if the marker exist if not, create it
		$.each(newMarkerPopulation, function(index, newWrapperMarker) {
			
			var wrapperAlreadyDraw = me._getInWrapperList(newWrapperMarker.wikiID);			
			if(wrapperAlreadyDraw===null){
				
				var markerMap = me._createMarkerMap(newWrapperMarker);				
				me.markers.push(markerMap);				
				me._createPopulationMarker(markerMap, newWrapperMarker.population,map);					
				markerMap.toRemove= false;
			}else{
				wrapperAlreadyDraw.marker.toRemove= false;
			}
			
		});		


		//delete all markers not set toRemove=false  (not present anymore)
		 for (var i = me.markers.length-1; i>=0; i--) {
			 if(this.markers[i].toRemove === true){
			     me.markers[i].removeMarkerFromMap();
				 me.markers.splice(i,1);	
			 }	 
		 }		
	},
	
	_onMouseClickMarker : function(markerMap){
		//this === marker and me is the wrapperMap instance
		var positionFromScreen = this._fromLatLngToPixelWindowPosition(markerMap.position,this.googleMap);
				
		$.event.trigger({
			type : CONFIG_FREIZE_MAP.CLICK_MARKER_MAP_EVENT_TYPE,
			idMarker : markerMap.idMarker,
			time : new Date(),
			position : positionFromScreen,
			marker : this._getOriginalMarker.call(this,markerMap.idMarker)
		});

		//check for other marker on the same position...
		//TODO
	},
	
	/**
	 * Get the marker's position relative to the screen!!
	 * @param idMarker marker to looking for
	 * @returns  {left:leftWindow, top:topWindow}
	 */
	getAbsoluteMarkerUIPositionFromId : function(idMarker){
		var markerMapId = this._getInWrapperList(idMarker),
				markerMap,
				positionFromScreen = null;
		
		if(markerMapId != null){
			markerMap = markerMapId.marker;
			 positionFromScreen = this._fromLatLngToPixelWindowPosition(markerMap.position,this.googleMap);			
		}
		return positionFromScreen;
		
	},
	
	_fromLatLngToPixelWindowPosition : function(latLng, map) {
		
		var mapWindowPosition= $(this.googleMap.getDiv()).offset();
		
		var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
		var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
		var scale = Math.pow(2, map.getZoom());
		var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
		var topWindow =(((worldPoint.y - topRight.y) * scale) + mapWindowPosition.top);
		var leftWindow =(((worldPoint.x - bottomLeft.x) * scale)+ mapWindowPosition.left );
		return {left:leftWindow, top:topWindow};
	},	
	
	_createMarkerMap : function (newWrapperMarker){
		
		var myLatlng = new google.maps.LatLng(newWrapperMarker.latitude,
				newWrapperMarker.longitude);
		
		var markerMap = new google.maps.Marker({
			title : newWrapperMarker.nameSurname + '- Naissance:' + newWrapperMarker.timestamp,
			timestamp : newWrapperMarker.timestamp,
			position : myLatlng,
			animation : google.maps.Animation.DROP, 
			/*TODO: next line to adapt just for TEST*/
			typeMarker: newWrapperMarker.type,
			idMarker: newWrapperMarker.wikiID,
			markerSource: newWrapperMarker,
			/*isEquals: function(latitude,longitude,timestamp){
				var myLatlngToCompare = new google.maps.LatLng(newWrapperMarker.latitude,
						newWrapperMarker.longitude);
				return this.position.equals(myLatlngToCompare) && this.timestamp === timestamp;
			},*/
			removeMarkerFromMap: function(){
				
				this.setMap(null);
				if(this.typeMarker===window.POPULATION_POINT_TYPE_MARKER){
					this.label.setMap(null);
					this.circle.setMap(null);
					this.label = null;
					this.circle = null;
				}
			}
		
		});		
		return markerMap;
		
	},
	
	_createPopulationMarker :  function (markerMap ,population,map){
		
		var populationOptions = {
	    	      clickable: false,	    	     
	    	      map: map,
	    	      center: markerMap.position,
	    	      // metres
	              radius: 100000, 
	              fillColor: '#fff',
	              fillOpacity: .6,
	              strokeColor: '#313131',
	              strokeOpacity: .4,
	              strokeWeight: .8
	    	    },	    	    
		circle = new google.maps.Circle(populationOptions),
		label = new LabelGoogleMap(circle.getBounds(),population,map);
		markerMap.circle = circle;
		markerMap.label = label;		
	},
	
	
	_getOriginalMarker : function (idMarker){
		var mapMarker= this._getInWrapperList(idMarker), markerSource = null;
		if(mapMarker != null){
			markerSource = mapMarker.marker.markerSource;
		}			
		return markerSource;
	},
	
	_getInWrapperList : function (idMarker){
		
		if(this.markers!=null){		
			 for (var i = 0; i < this.markers.length; i++) {
				 if(this.markers[i].idMarker==idMarker){
					 return {index: i, marker: this.markers[i]};
				 }	 
			 }
		}
		
		return null;
	}
	
};