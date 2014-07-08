/*
 * Display some PopupResource in a layer, ABSOLUTE POSITION.  
 */
//inheritance
function ResourcesPopupLayer(){
	this.$DivPanel = $('#infoWindowsAbsoluteLayer');	
	this.marginLeft = 50; //100px
}

//inheritance
ResourcesPopupLayer.prototype = new ResourcesContainer();
ResourcesPopupLayer.prototype.constructor = ResourcesPopupLayer;

/**
 * Anchor the window to this panel
 * @param windowResource
 */
ResourcesPopupLayer.prototype.addPopUpResource = 
	 function(windowResource) {		
		this.push(windowResource);	
		
		this.$DivPanel.append(windowResource.getJQueryAnchor());
		var positionCenterWindow = this._computeWindowCenterPosition(windowResource);		
		windowResource.display(positionCenterWindow);
		
	};
	
ResourcesPopupLayer.prototype.removeAllWindows = 
	function() {		
		this.removeAll();		
		this.$DivPanel.empty();
	};
	
	
ResourcesPopupLayer.prototype._computeWindowCenterPosition =
	function(popup){
		//first window: center on the right
		var width = popup.getWidth(),
		    height = popup.getHeight();
		var tempLeft = window.innerWidth - width/2 - this.marginLeft;
		var tempTop = window.innerHeight/2 ;		
		
		return {top : tempTop, left :tempLeft};
	};
	