/*
 * Display lines between resource windows and markers, Like all layer is ABSOLUTE POSITION.  
 */
//inheritance
function ResourceMarkerLinkLayer(){
	this.$DivPanel = $('#resourceMarkerLinkLayer');	
	this.$canvasDivArray = new Array();
}

/**
 * Anchor the window to this panel
 * @param windowResource
 */
ResourceMarkerLinkLayer.prototype ={
		
		linkToMarkers : function(windowMarker,positionMarkerMap,positionMarkerFrise){
			
			var $canvas = this._createLines(windowMarker,positionMarkerMap,positionMarkerFrise);
			$canvas.idMarker = windowMarker.marker.wikiID;
			
			this.$canvasDivArray.push($canvas);
		},
		
		removeAllLines : function() {
			$.each(this.$canvasDivArray, function(index, $canvas) {
				$canvas.remove();
			});
			this.$canvasDivArray = new Array();
		},
		
		remove : function (markerId){
			var me = this;
			$.each(this.$canvasDivArray, function(index, $canvas) {
				if (markerId == $canvas.idMarker) {
					$canvas.remove();
					me.$canvasDivArray.splice(index,1);
					return false;
				}
			});
			
		},

		
		_createLines : function (resourceWindow,positionMarkerMap,positionMarkerFrise){
		
			//TODO not put on the div panel '#infoWindowsAbsoluteLayer?????
		    var $canvas = $('<canvas  class=\'layerCanvas\' width=\''+window.outerWidth+'\' height=\''+window.outerHeight+'\'></canvas>')
		        .appendTo('#resourceMarkerLinkLayer');
		    	$canvas.zIndex(window.CONFIG_Z_INDEX.LINK_WITH_RESOURCES);
		        var positionCenterWindow =resourceWindow.getCenterPosition(),
		        ctx,	linesAnimations,		    
		        windowLeft       = positionCenterWindow.left,
		        windowTop        = positionCenterWindow.top,
		        windowLeftCenter = positionCenterWindow.left,
		        windowTopCenter  = positionCenterWindow.top,
		        windowHeight     = resourceWindow.getHeight(),
		        windowWidth      = resourceWindow.getWidth(),
		        markerFriseLeft  = positionMarkerFrise.left,
		        markerFriseTop   = positionMarkerFrise.top,
		        markerMapLeft,markerMapTop;
		    
		       
		        
		        if(positionMarkerMap!=null){
		        	markerMapLeft    = positionMarkerMap.left,
			        markerMapTop     = positionMarkerMap.top;
			        
		        	if(markerMapLeft>(windowLeftCenter + windowWidth/2)){
				    	//marker on the right
				    	windowLeft = windowLeftCenter + windowWidth/2;
				    }else if(markerMapLeft<(windowLeftCenter - windowWidth/2)){
				    	//marker on the left
				    	windowLeft = windowLeftCenter - windowWidth/2;
				    }else if(markerMapTop<windowTopCenter - windowHeight/2){
				        //marker just on the top
				    	windowTop = windowTopCenter - windowHeight/2;
				    }else if(markerMapTop>windowTopCenter + windowHeight/2){
				        //marker just on the bottom
				    	windowTop = windowTopCenter + windowHeight/2;
				    }
		        }
		        
		    // Make sure we don't execute when canvas isn't supported
		    if ($canvas[0].getContext){			   
		      // use getContext to use the canvas for drawing
		       ctx = $canvas[0].getContext('2d');			   
		       linesAnimations = new LinesAnimation(ctx);
		       linesAnimations.addLine({left:windowLeft,top:windowTop},{left:markerMapLeft,top:markerMapTop});
		       
		       if(markerFriseLeft>(windowLeftCenter + windowWidth/2)){
			    	//marker on the right
			    	windowLeft = windowLeftCenter + windowWidth/2;
			    }else if(markerFriseLeft<(windowLeftCenter - windowWidth/2)){
			    	//marker on the left
			    	windowLeft = windowLeftCenter - windowWidth/2;
			    }else if(markerFriseTop<windowTopCenter - windowHeight/2){
			        //marker just on the top
			    	windowTop = windowTopCenter - windowHeight/2;
			    }else if(markerFriseTop>windowTopCenter + windowHeight/2){
			        //marker just on the bottom
			    	windowTop = windowTopCenter + windowHeight/2;
			    }
		       linesAnimations.addLine({left:windowLeft,top:windowTop},{left:markerFriseLeft,top:markerFriseTop});
		       linesAnimations.startDraw();
		    } else {
		    	console.info('Impossible to draw line. Update the navigator. Canvas API not supported');
				
		    }	
		    return $canvas;
	}
	
    
};
	

