/*
 * Display some PopupResource in a panel, (the panel is hidden from the screen at startup)  
 */
//inheritance
function ResourcesPanel(){
	this.$DivPanel = $('#panelResources');
	this.$DivPanel.css('z-index',  window.CONFIG_Z_INDEX.PANEL_RESOURCES);
	
	/*this.$handlePanel = new HandlePanel(this.$DivPanel);
	this.$handlePanel.onHeightChange(function(heightPercent){
		
		$.event.trigger({
			type : CONFIG_FREIZE_MAP.XXXXXXXXXXXXXXXXX,
			heightPercent : heightPercent,
			time : new Date()
		});
	});*/
	
}

//inheritance
ResourcesPanel.prototype = new ResourcesContainer();
ResourcesPanel.prototype.constructor = ResourcesPanel;

/**
 * Anchor the window to this panel
 * @param windowResource
 */
ResourcesPanel.prototype.addWindowResource = function(windowResource,onReadyFunction) {
		var isfirstWindow= this.isEmpty();
		windowResource.detach();
		windowResource.resetStyle();
		windowResource.css({
			position: 'relative',	
			display: 'block',		
			padding: '5px 0px 0px 0px'
		});		
		windowResource.hiddeAnchorButton();
		this.$DivPanel.append(windowResource.getJQueryAnchor());
		this.push(windowResource);
		//add listener
		if(isfirstWindow){
			this._show(onReadyFunction);			
		}else{
			onReadyFunction();
		}
		
		
	};

ResourcesPanel.prototype._show = function(onReadyFunction){
	//this.$handlePanel.display();		
	
	this.$DivPanel.css('padding',  '5px');
	this.$DivPanel.css('border',  '2px');
	this.$DivPanel.animate({left: '0px'},{duration:window.CONFIG_ANIMATION.TIME_MEDIAN*2,
										  complete:onReadyFunction});
	
};	

/*hide this panel and the last window*/
ResourcesPanel.prototype._hide = function(windowResource){
	var me = this;
	this.$DivPanel.animate({left: '-700px'},window.CONFIG_ANIMATION.TIME_MEDIAN*2, function(){
		me._remove(windowResource);
	});
};	
	
ResourcesPanel.prototype.remove = function(windowResource){
	
	if(this.getWindowNbr()==1){
		this._hide(windowResource);//last one
	}else{
		this._remove(windowResource);
	}
	
};
 

