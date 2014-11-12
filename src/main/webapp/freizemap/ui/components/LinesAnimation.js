function LinesAnimation(ctx2D){	
	this.lines = new Array();
	this.ctx2D = ctx2D;
	this.velX = 0;
	this.velY = 0;	
	
	this.ctx2D.lineWidth = 2;
}

LinesAnimation.prototype = {

    /**
     * line is {top:xx,left:yy} depends on windows
     */
	addLine : function (startPoint,endPoint){
		drawLine = new DrawLine(startPoint,endPoint);
		this.lines.push(drawLine);
	},
	
	startDraw : function (){
		var me = this;
		$.each(this.lines, function(index, line) {
			line.draw(me.ctx2D);
		});
	}
};