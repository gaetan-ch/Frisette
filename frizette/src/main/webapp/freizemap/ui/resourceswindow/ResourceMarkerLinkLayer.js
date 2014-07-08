/*
 * Display lines between resource windows and markers, Like all layer is ABSOLUTE POSITION.  
 */
//inheritance
function ResourceMarkerLinkLayer(){
	this.$DivPanel = $('#resourceMarkerLinkLayer');	
	this.$canvasDivArray = new Array();
	this.velX = 0;
	this.velY = 0;
	this.x = 0;
	this.y = 0;
}

/**
 * Anchor the window to this panel
 * @param windowResource
 */
ResourceMarkerLinkLayer.prototype ={
		
		linkToMarkers : function(windowMarker,positionMarkerMap,positionMarkerFrise){
			

			//console.info(' popup' + positionMarkerMap.left+'-'+ positionMarkerMap.top + ' - map: '+ positionCenterWindow.left +'-'+positionCenterWindow.top);
			
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
//		       ctx.beginPath();
//		       ctx.moveTo(windowLeft,windowTop);
//		       ctx.lineTo(markerFriseLeft,markerFriseTop);
//		       ctx.stroke();
//		   
		    } else {
		    	console.info('Impossible to draw line. Update the navigator. Canvas API not supported');
				
		    }	
		    return $canvas;
	},
	_drawline : function(ctx,anchorWindowPosition, anchorMarketPosition){
		// Filled triangle
	       
	       i = 0;
	     //find the window anchor
	       if(anchorMarketPosition!=null){
	    	   
	    	   this.velX = 0;
	    	   this.velY = 0;
	    	   this.x = anchorWindowPosition.left;
	    	   this.y = anchorWindowPosition.top;
	    	   this._draw(this,ctx,anchorMarketPosition);
	       }		
	},
	
	_draw : function(me,ctx, anchorMarkerPosition){   
        var lastPointX= me.x,
        	lastPointY= me.y;
      
        var tx = anchorMarkerPosition.left - me.x,
            ty = anchorMarkerPosition.top - me.y,
            goal_dist = Math.sqrt(tx*tx+ty*ty),
            speed_per_tick  = 20;
            //rad = Math.atan2(ty,tx);
            //angle = rad/Math.PI * 180;;
        
        if (goal_dist > speed_per_tick)
        {
            var ratio = speed_per_tick / goal_dist;
            var x_move = ratio * tx;  
            var y_move = ratio * ty;
            me.x = x_move + me.x ;  
            me.y = y_move + me.y;
        }
        else
        {
        	me.x = anchorMarkerPosition.left; 
        	me.y = anchorMarkerPosition.top;
        }
	  
        
        
       
        //ctx.clearRect(0,0,400,400);
       
        //ctx.rect(me.x, me.y, 4, 4);
        console.info('(lastPointX,lastPointY)'+ lastPointX + ' <>' + lastPointY + 
        			' (me.x,me.y)'+ me.x + ' <>' + me.y
        			+ ' (anchorMarkerPosition.left,anchorMarkerPosition.top)'+ anchorMarkerPosition.left + ' <>' + anchorMarkerPosition.top);
        console.info();
        ctx.strokeStyle='#201e1b';
        ctx.moveTo(lastPointX,lastPointY);
 	    ctx.lineTo(me.x,me.y);
 	    ctx.stroke();  
        
        /**/
        
        //check if it is near the end
        if( Math.abs(me.x -anchorMarkerPosition.left)>2 &&  Math.abs(me.y -anchorMarkerPosition.top)>2){        	
        	setTimeout(function(){
            	me._draw(me,ctx, anchorMarkerPosition);
            	}, 20);
        }else{
        	ctx.fillStyle = "#ff0";
            ctx.beginPath();
            ctx.rect(anchorMarkerPosition.left, anchorMarkerPosition.top, 10, 10);
            ctx.closePath();
            ctx.fill();
        }
           
    },
    
};
	

