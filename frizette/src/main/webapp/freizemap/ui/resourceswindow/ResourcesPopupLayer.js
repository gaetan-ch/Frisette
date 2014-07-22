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
	 function(windowResource, topPoint, bottomPoint) {
	
		this.push(windowResource);	
		this.$DivPanel.append(windowResource.getJQueryAnchor());
		var positionCenterWindow = this._computeWindowCenterPosition(windowResource, topPoint, bottomPoint);		
		windowResource.display(positionCenterWindow);
		
	};
	
ResourcesPopupLayer.prototype.removeAllWindows = 
	function() {		
		this.removeAll();		
		this.$DivPanel.empty();
	};
	
	
ResourcesPopupLayer.prototype._computeWindowCenterPosition =
	function(popup, topPoint, bottomPoint){
		var popupTop, popupLeft,
			widthPopup = popup.getWidth(),
			heightPopup = popup.getHeight();
		
		if(topPoint===null){
			popupLeft = bottomPoint.left + widthPopup*1.5;
			popupTop  = bottomPoint.top + heightPopup*1.5;
		}else if (bottomPoint===null){
			popupLeft = topPoint.left + widthPopup*1.5;
			popupTop  = topPoint.top + heightPopup*1.5;
		}else{
			popupLeft = (bottomPoint.left + topPoint.left)*0.5 + widthPopup*1.5;
			popupTop  = (bottomPoint.top + topPoint.top)*0.5 + heightPopup*1.5;
		}
		
		//check if out of window	
		if( (popupLeft+ widthPopup > window.innerWidth) || (popupTop+ heightPopup > window.innerHeight) ){
			popupLeft = window.innerWidth - widthPopup/2 - this.marginLeft;
			popupTop = window.innerHeight/2 ;		
		}
		
		return {top : popupTop, left :popupLeft};
	};
	