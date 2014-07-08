HandlePanel.viewHtml='<div class=\'handlePanel\' id=\'${id}\'>BLABLA</div>';

var generateID = 1025; //voir autrement
function HandlePanel(panelParent) {  
  // Now initialize all properties.
  if(panelParent instanceof jQuery){
	  this.$panelParent = panelParent;  
  }else{
	  this.$panelParent = $(panelParent);
  }
    
  this._move = 0;
  this.panelParentPosition = null;
  this.isHide = false;
  this.eventsType = ['HEIGHT_CHANGE'];
  this.synchroneEventHandler = new SynchroneEventHandler(this.eventsType);
  this.$panelHandleTag = $(HandlePanel.viewHtml.replace('${id}',generateID++));
};

HandlePanel.prototype.POSITION_TOP=1;
HandlePanel.prototype.POSITION_LEFT=2;
HandlePanel.prototype.POSITION_RIGHT=3;
HandlePanel.prototype.POSITION_BOTTOM=4;

HandlePanel.prototype.onHeightChange = function(functionOnHeightChange) {		
	this.synchroneEventHandler.addListener('HEIGHT_CHANGE', functionOnHeightChange);
},


HandlePanel.prototype.display = function() {
	var me =this;
	
	this.$panelParent.prepend(this.$panelHandleTag);

	this.$panelHandleTag.css('zIndex',CONFIG_Z_INDEX.HANDLER_PANEL);
	//this.attr('id','256');
	
	this.$panelParent.on('resize',function () {
		console.info("resize the panel");
	});
	
	this.$panelHandleTag.on('mousedown',function(e){
		console.info("mouse down the handler of the panel");
		//handle mouse move 	and mouse up
		me.$panelHandleTag.on('mousemove',{me:me} , me._onMouseMove);
		me.$panelHandleTag.on('mouseup',{me:me}, me._onMouseUp);
	});
	
	this._positionHandleUpsideParentPanel();
	
	return this;
};

HandlePanel.prototype._positionHandleUpsideParentPanel = function(){
	//find is the panel is on the left, right,bottom or on the top
	var topLeftWindow = this._createPosition(0, 0);
	var topRightWindow = this._createPosition(0, window.innerWidth);
	var bottomLeftWindow = this._createPosition(window.innerHeight, 0);
	var bottomRightWindow = this._createPosition(window.innerHeight, window.innerWidth);
	
	var topLeftPanel = this._createPosition(this.$panelParent.offset().top,this.$panelParent.offset().left);
	var topRightPanel = this._createPosition(this.$panelParent.offset().top,this.$panelParent.offset().left + this.$panelParent.innerWidth());
	var bottomLeftPanel = this._createPosition(this.$panelParent.offset().top + this.$panelParent.innerHeight(),this.$panelParent.offset().left);
	var bottomRightPanel = this._createPosition(this.$panelParent.offset().top + this.$panelParent.innerHeight(),this.$panelParent.offset().left + this.$panelParent.innerWidth());
	
	if(topLeftWindow.isEquals(topLeftPanel) && topRightWindow.isEquals(topRightPanel)){  
		//panel on the window top
		console.info("panel on the top");
		this.$panelHandleTag.css({
			bottom: '-10%',
			left: '80%',
			width: '5%',  
			height: '10%',
			position: 'absolute',
			'z-index': window.CONFIG_Z_INDEX.HANDLER
		});
		this.panelParentPosition = HandlePanel.prototype.POSITION_TOP;
	}else if((topLeftWindow.isEquals(topLeftPanel)  && bottomLeftWindow.isEquals(bottomLeftPanel))
				|| ( topLeftPanel.left<topLeftWindow.left && bottomLeftPanel.left<bottomLeftWindow.left)){
		//panel on the window left
		console.info("panel on the left");
		this.$panelHandleTag.css({
			top: '70%',
			right: '-10%',
			width: '5%',  
			height: '10%',
			position: 'absolute',
			'z-index': window.CONFIG_Z_INDEX.HANDLER
		});
		this.panelParentPosition = HandlePanel.prototype.POSITION_LEFT;
	}else if(bottomLeftWindow.isEquals(bottomLeftPanel) && bottomRightWindow.isEquals(bottomRightPanel)){
		//panel on the window bottom
		console.info("panel on the bottom");
		this.$panelHandleTag.css({
			top: '-9%',
			left: '70%',
			width: '5%',  
			height: '10%',
			position: 'absolute',
			'z-index': window.CONFIG_Z_INDEX.HANDLER
		});
		this.panelParentPosition = HandlePanel.prototype.POSITION_BOTTOM;
	}else if(topRightWindow.isEquals(topRightPanel) && bottomRightWindow.isEquals(bottomRightPanel)){
		//panel on the window right
		console.info("panel on the right");
		this.panelParentPosition = HandlePanel.prototype.POSITION_RIGHT;
		
	}else{
		console.debug("The panel should have 2 points on corner window");
		
	}
	
};

HandlePanel.prototype._createPosition = function(top, left){
	return {
		'top':top,
		'left':left,
		isEquals : function(position2){
			return position2.top == top && position2.left == left;
		}};
};

HandlePanel.prototype._onMouseMove = function(event){
	console.info("mouse MOVE the handler of the panel");
	event.data.me._move = event.data.me._move + 1;
};

HandlePanel.prototype._onMouseUp = function(event){
	var me = event.data.me;
	console.info("mouse UP the handler of the panel");
	
	if(me._move < 2){
		//the first move is for the click?! 
		console.info("click the handler of the panel, close the parent panel");
		me._hidePanel.call(me);
		
	}
	
	me.off('mousemove',me._onMouseMove);
	me.off('mouseup',me._onMouseUp);
	me._move = 0;
};

/**
 * 
 */
HandlePanel.prototype._hidePanel = function(){
	me = this;
	this.$panelParent.animate({height :'0%'},{
		duration :window.CONFIG_ANIMATION.TIME_MEDIAN,
		step: function(number,tween){
			console.info("step" + me.$panelParent.height());
				me.synchroneEventHandler.fire('HEIGHT_CHANGE',number);
			},
		progress: function(promise,progress,remainingMs ){
			console.info("progress");
			}
		}
	);
	this._positionHandleUpsideParentPanel();
};