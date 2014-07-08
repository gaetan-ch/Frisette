/* Windows information controler
 * */

function ResourcesWindowControler(){
	
	//display windows in absolute way
	this.layerResources=new ResourcesPopupLayer();
	
	//display the same windows in relative way in a Panel
	this.panelResources= new ResourcesPanel();	
	
	//manage the lines between markers and reource window
	this.layerResourceMarkerLink = new ResourceMarkerLinkLayer();

	this.windowsSelected = new Array();
	//this.maxPopup = 5;
};

ResourcesWindowControler.prototype = {
		addWindow : function(marker, positionMarkerMap,positionMarkerFrise) {
			var me = this, windowMarker;
			
			//check if the marker is already present
			//if(this.floatwindowsList.length>=this.maxPopup){
				//remove the first popup
			//}
			windowMarker = this.layerResources.getWindowFromMarker(marker.wikiID);
			if(windowMarker==null){
				//A placer dans le controler
				windowMarker = new PopUpResource(marker);
				
				this.layerResources.addPopUpResource(windowMarker);				
				me.selectWindow(marker.wikiID,positionMarkerMap,positionMarkerFrise);	
				//listen
				windowMarker.setObserversFunction({
					onCloseRequest : function($popup){
						me._closeWindow($popup);
					},
					onAnchorRequest : function($popup){
						me._anchorWindow($popup);
					}
				});
				
			}else{
				//Not here...
				this.unSelectWindow(marker.wikiID);
			}
			
			
		},
		
		removeMarkers : function (markers){
			// remove the markers
			
		},

		deleteAllWindow : function (){				
			this.layerResources.removeAllWindows();
			this.layerResourceMarkerLink.removeAllLines();
			this.windowsSelected = new Array();
		},
		
				
		_anchorWindow : function (windowToAnchor){
			console.info('anchor the window');
			
			//delete line from link layer
			this.layerResourceMarkerLink.remove(windowToAnchor.marker.wikiID);
			
			//add the window to the panel Anchor
			this.panelResources.addWindowResource(windowToAnchor);
			
			//redraw line
			//this.layerResourceMarkerLink.linkToMarkers(windowMarker,positionMarkerMap,positionMarkerFrise);
		},
		
		_closeWindow : function (windowToClose){
			console.info('close the window');
			if(this.layerResources.getWindowFromMarker(windowToClose.marker.wikiID)!=null){
				this.layerResources.remove(windowToClose);
			}else{
				//if is not in absolute layer, it is on panel resources 
				this.panelResources.remove(windowToClose);
			}
			
			this.layerResourceMarkerLink.remove(windowToClose.marker.wikiID);
			this.windowsSelected.splice(this._indexMarkerSelected(windowToClose.marker.wikiID), 1);	
		},

		isMarkerPresent : function(idMarker){
			return this.layerResources.getWindowFromMarker(idMarker)!=null 
			|| this.panelResources.getWindowFromMarker(idMarker)!=null;
			
		},
		
		unSelectWindow : function(idMarker){
			this.layerResources.unSelectWindow(idMarker);
			this.panelResources.unSelectWindow(idMarker);
			this.layerResourceMarkerLink.remove(idMarker);
			var indexMarkerSelected = this._indexMarkerSelected(idMarker);
			this.windowsSelected.splice(indexMarkerSelected, 1);
		},
		
		selectWindow : function(idMarker,positionMarkerMap,positionMarkerFrise){
			var indexMarkerSelected = this._indexMarkerSelected(idMarker), windowSelected;
			
			if(indexMarkerSelected > -1){				
				this.unSelectWindow(idMarker);
			}else{				
				windowSelected = this.panelResources.selectWindow(idMarker);
				
				if(windowSelected == null){
					windowSelected = this.layerResources.selectWindow(idMarker);							
				}
				this.windowsSelected.push(idMarker);
				this.layerResourceMarkerLink.linkToMarkers(windowSelected,positionMarkerMap,positionMarkerFrise);
			}
		},
		
		_indexMarkerSelected : function(idMarker){			
			var indexMarkerFind = -1;
			$.each(this.windowsSelected, function(index, idMarkerSelected) {
				if (idMarker == idMarkerSelected) {
					indexMarkerFind = index;
					return false;
				}
			});
			return indexMarkerFind;
		}
};
