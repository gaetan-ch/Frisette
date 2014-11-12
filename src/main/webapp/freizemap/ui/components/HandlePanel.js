HandlePanel.viewHtml='<div class=\'handlePanel\' id=\'handlePanel_${id}\'></div>';


function HandlePanel(contentPanel, position) {  
  // Now initialize all properties.
  if(contentPanel instanceof jQuery){
	  this.$contentPanel = contentPanel;  
  }else{
	  this.$contentPanel = $(contentPanel);
  }
  this.contentPanelPosition = position;
	  
  this.typeEvent = null;
  this.isHide = false;
  this.eventsType = ['HEIGHT_CHANGE'];
  this.synchroneEventHandler = new SynchroneEventHandler(this.eventsType);
  this.$panelHandleTag = $(HandlePanel.viewHtml.replace('${id}',window.GENERATE_ID++));
  this.initialDimension = {height:this.$contentPanel.height(),width:this.$contentPanel.width()};
  
  this.timeLauncher = null; //use to reduce fire event
  
};

HandlePanel.prototype.POSITION_TOP=1;
HandlePanel.prototype.POSITION_BOTTOM=4;
HandlePanel.prototype.FIRST_MOUSE_MOVE_IS_CLICK='click';
HandlePanel.prototype.DRAG_MOUSE_MOVE='drag';

//to remove
HandlePanel.prototype.onHeightChange = function(functionOnHeightChange) {		
	this.synchroneEventHandler.addListener('HEIGHT_CHANGE', functionOnHeightChange);
},


HandlePanel.prototype.display = function() {
	var me =this;
	
	this.$contentPanel.prepend(this.$panelHandleTag);

	this.$panelHandleTag.css('zIndex',CONFIG_Z_INDEX.HANDLER_PANEL);	
	
	this.$contentPanel.on('resize',function () {
		console.info("resize the panel");
	});
	
	this.$panelHandleTag.on('mousedown',function(e){
		console.info("mouse down the handler of the panel");
		//handle mouse move 	and mouse up
		me.$panelHandleTag.on('mousemove',{me:me} , me._onMouseMove);
		me.$panelHandleTag.on('mouseup',{me:me}, me._onMouseUp);
	});
	this.$panelHandleTag.on('mouseenter',{me:me},me._onMouseEnter);
	
	this._positionHandleUpsideParentPanel();
	
	return this;
};

/*HandlePanel.prototype._createPosition = function(top, left){
	return {
		'top':top,
		'left':left,
		isSimilars : function(position2){
			//sometimes there is 0.5 pixel difference!? in this case two point are the same
			// so we take 5 pixels
			
			var nbeSimilarFunction = function(nbe1,nb2, approximation){
				//nbe1 ==(+-5 + nb2)
				return (nbe1 < nb2+approximation) && (nbe1 > nb2-approximation);
			};
			
			return nbeSimilarFunction(position2.top,top,5) &&  nbeSimilarFunction(position2.left,left,5);
		}
	};
};*/

HandlePanel.prototype._onMouseEnter = function(event){ 
	console.info("mouse enter the handler of the panel>>> reset");
	var me = event.data.me;
	me._resetMouseDragEvent();	
};

HandlePanel.prototype._onMouseMove = function(event){
	console.info("mouse MOVE the handler of the panel");
	var me = event.data.me;

	if(event.data.me.typeEvent === null){
		me.typeEvent = me.FIRST_MOUSE_MOVE_IS_CLICK;	
		
		me.initialMousePosition= {left:(event.pageX ), top:(event.pageY)};
		
		//follow the mouse on the document
		$(document).on('mousemove',{me:me},me._mouseDocumentMove);
		
		//on mouse up remove listener
		$(document).on('mouseup',{me:me},me._mouseDocumentUp);
		
	}else{
		me.typeEvent = me.DRAG_MOUSE_MOVE;		
		
	}
};

HandlePanel.prototype._mouseDocumentUp = function(event){
	var me = null;
	if(event === undefined){
		me = this;
	}else{
		me = event.data.me;
	}
	$(document).off('mousemove',me._mouseDocumentMove);
	$(document).off('mouseup',me._mouseDocumentUp);
	me.initialMousePosition= null;
	console.info("End drag handle panel");
};

HandlePanel.prototype._mouseDocumentMove = function(event){
	var me = event.data.me;
	if(me.initialMousePosition===null){
		me.initialMousePosition = {left:(event.pageX ), top:(event.pageY)};
		/*me.timeLauncher = new TimeLauncher({
			functionToCall : me._updateContentPanelDimension,
			functionShoulBeCalled : 'undefined',
			contextThis : me,
			repeat : false,
			reloadTime : 500//CONFIG_FREIZE_MAP.TIME_FRISE_DRAG_HANDLE_LAYER_MS	
		});*/
	}else{
		
		var differenceFromInitialPosition = {
								height:(event.pageY - me.initialMousePosition.top),
								width:(event.pageX - me.initialMousePosition.left)};
		var newHeight = me.initialDimension.height - differenceFromInitialPosition.height;
		var newHeightPercent = (newHeight*100)/me.initialDimension.height;
		me.$contentPanel.height(newHeightPercent+'%');
		//me.$contentPanel.animate('height',newHeightPercent );
		//me.$contentPanel.css('height','\''+(newHeightPercent + '%\''));
		console.info("New Height content panel, eventpageY: " + event.pageY + ' newHeightPercent:'+newHeightPercent + '  see:'+me.$contentPanel.height());
		//so we fire height change until 30% when we hide the panel
		if(newHeight< me.initialDimension.height/3){
			me._mouseDocumentUp();
			me._clickHandlePanel.call(me);	
		}
	}
	
};

HandlePanel.prototype._onMouseUp = function(event){
	var me = event.data.me;
	console.info("mouse UP the handler of the panel");
	
	if(me.typeEvent === null || me.typeEvent === this.FIRST_MOUSE_MOVE_IS_CLICK){
		//the first move is for the click?! 
		console.info("click the handler of the panel");
		
		
		me._clickHandlePanel.call(me);		
	}else{//(me.typeEvent ===this.DRAG_MOUSE_MOVE)
		//if the height is more than 50% we close the panel 
	}
	me._resetMouseDragEvent();
	
};

HandlePanel.prototype._resetMouseDragEvent = function(){
	this.$panelHandleTag.off('mousemove',this._onMouseMove);
	//this.$panelHandleTag.off('mouseup',this._onMouseUp);
	this.typeEvent = null;	
	if(this.timeLauncher!==null){
		this.timeLauncher.deleteTimer();
	}
	this.timeLauncher = null;
};

/**
 * 
 */
HandlePanel.prototype._clickHandlePanel = function(){
	this.$panelHandleTag.off('mousemove',this._onMouseMove);
	this.$panelHandleTag.off('mouseup', this._onMouseUp);
	this.onClickHandle();
};

/*please overwrite*/
HandlePanel.prototype.onClickHandle = function(){};


HandlePanel.prototype._positionHandleUpsideParentPanel = function(){
	
	if(this.contentPanelPosition === HandlePanel.prototype.POSITION_TOP){  
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
		
	}else if(this.contentPanelPosition === HandlePanel.prototype.POSITION_BOTTOM){
		//panel on the window bottom
		console.info("panel on the bottom");
		var height = (this.$contentPanel.innerHeight()*10/100);
		this.$panelHandleTag.css({
			top: '-'+height  + 'px',
			left: '70%',
			width: '5%', 
			height: height  + 'px',
			position: 'absolute',
			'z-index': window.CONFIG_Z_INDEX.HANDLER
		});
	
	
	}else{
		console.debug("The panel should be top or bottom");		
	}	
};
