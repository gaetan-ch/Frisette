/**
 * Base class for panel and layer which display windowResource. Manage their
 * resources
 */

function ResourcesContainer() {
	this.resourcesWindowsList = new Array();
};

ResourcesContainer.prototype = {
	push : function(windowResource) {
		this.resourcesWindowsList.push(windowResource);
	},

	removeAll : function() {
		this.resourcesWindowsList = new Array();
	},
	
	getWindowFromMarker : function(idMarker) {
		var windowFind = null;
		$.each(this.resourcesWindowsList, function(index, window) {
			if (window.marker.wikiID == idMarker) {
				windowFind = window;
				return false;
			}
		});
		return windowFind;
	},
	
	_getIndexWindow : function(idMarker) {
		var indexWindow = -1;
		$.each(this.resourcesWindowsList, function(index, window) {
			if (window.marker.wikiID == idMarker) {
				indexWindow = index;
				return false;
			}
		});
		return indexWindow;
	},
	
	_remove : function(windowResource) {
		//var windowFind = this.getWindowFromMarker(windowResource.marker.wikiID);
		if(windowResource!=null){
			windowResource.remove();
			var index = this._getIndexWindow(windowResource.marker.wikiID);
			this.resourcesWindowsList.splice(index, 1);
			return true;
		}
		return false;
	},
	remove : function(windowResource) {
		this._remove(windowResource);
	},
	
	selectWindow : function (idMarker){
		var window = this.getWindowFromMarker(idMarker);
		if(window!=null){
			window.select();
		}
		return window;
	},
	
	unSelectWindow : function (idMarker){
		var window = this.getWindowFromMarker(idMarker);
		if(window!=null){
			window.unSelect();
		}
		return window;
	},
	//NO window
	isEmpty : function(){
		return this.resourcesWindowsList.length == 0;	
	},
	 getWindowNbr: function(){
		return this.resourcesWindowsList.length;	
	}
	

};