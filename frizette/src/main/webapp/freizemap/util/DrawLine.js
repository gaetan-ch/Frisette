function DrawLine(startPoint, endPoint){
	
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	//set current point
	this.x = startPoint.left;
	this.y = startPoint.top;
	this.ctx2D = null;
}

DrawLine.prototype = {
	draw : function (ctx2D){
		this.ctx2D = ctx2D;
		this._drawSegment();
	},

	_drawSegment : function(){ 
		var me = this;
	    var lastPointX= me.x,
	    	lastPointY= me.y;
	  
	    var tx = me.endPoint.left - me.x,
	        ty = me.endPoint.top - me.y,
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
	    	me.x = me.endPoint.left; 
	    	me.y = me.endPoint.top;
	    }	   
	    //ctx.clearRect(0,0,400,400);
	   
	    //ctx.rect(me.x, me.y, 4, 4);
	    console.info('(lastPointX,lastPointY)'+ lastPointX + ' <>' + lastPointY + 
	    			' (me.x,me.y)'+ me.x + ' <>' + me.y
	    			+ ' (me.endPoint.left,me.endPoint.top)'+ me.endPoint.left + ' <>' + me.endPoint.top);
	    console.info();
	    this.ctx2D.strokeStyle='#201e1b';
	    this.ctx2D.moveTo(lastPointX,lastPointY);
	    this.ctx2D.lineTo(me.x,me.y);
	    this.ctx2D.stroke();  
	    
	    /**/
	    
	    //check if it is near the end
	    if( Math.abs(me.x -me.endPoint.left)>2 &&  Math.abs(me.y - me.endPoint.top)>2){        	
	    	setTimeout(function(){
	        		me._drawSegment();
	        	}, 20);
	    }else{
	    	this.ctx2D.fillStyle = "#ff0";
	    	this.ctx2D.beginPath();
	    	this.ctx2D.rect(me.endPoint.left, me.endPoint.top, 10, 10);
	    	this.ctx2D.closePath();
	    	this.ctx2D.fill();
	    }
		       
	}
};