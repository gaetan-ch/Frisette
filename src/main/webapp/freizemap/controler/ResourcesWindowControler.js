/* Windows information controler
 * */

function ResourcesWindowControler( freizeMapControler){
	
	//display windows in absolute way
	this.layerResources=new ResourcesPopupLayer();
	
	this.freizeMapControler = freizeMapControler;
	
	//display the same windows in relative way in a Panel
	this.panelResources= new ResourcesPanel();	
	
	//manage the lines between markers and reource window
	this.layerResourceMarkerLink = new ResourceMarkerLinkLayer();

	this.windowsSelected = new Array();
	//this.maxPopup = 5;
};

ResourcesWindowControler.prototype = {
		
		ressourceMapOrFriseSelected : function(marker,mapPosition,frizePosition){
			
			if(this.isMarkerPresent(marker.wikiID)){
				this.toggleWindow(marker.wikiID, mapPosition, frizePosition/*frise position*/);						
			}else{
				this.addWindow(marker, mapPosition, frizePosition/*frise position*/);
				this.selectWindow(marker.wikiID,mapPosition,frizePosition);	
			}
		},
		
		addWindow : function(marker, mapPosition, frizePosition) {
			var me = this, windowMarker;
			
			windowMarker = this.layerResources.getWindowFromMarker(marker.wikiID);
			if(windowMarker==null){
				//A placer dans le controler
				windowMarker = new PopUpResource(marker);
				
				this.layerResources.addPopUpResource(windowMarker,frizePosition, mapPosition );				
				
				//listen
				windowMarker.setObserversFunction({
					onCloseRequest : function($popup){
						me._closeWindow($popup);
					},
					onAnchorRequest : function($popup){
						me._anchorWindow($popup);
					}
					,
					onSelectWindow : function($popup){
												
						var markerId= $popup.marker.wikiID;
						if(me._indexMarkerSelected(markerId)===-1){
							//not selected
							//go to the controler which send back to map and frize
							me.freizeMapControler.selectMarker(markerId);
						}else{
							me.unSelectWindow(markerId);
						}
					}
				});
				
			}else{
				console.error('Window should not have been found...');
			}
			
			
		},
		
		removeMarkers : function (markers){
			// remove the markers
			
		},

		deleteAllWindow : function (){				
			this.layerResources.removeAllWindows();
			//don't remove window on the left panel
			//this.panelResources.removeAll();
			this.layerResourceMarkerLink.removeAllLines();
			this.windowsSelected = new Array();
		},
		
				
		_anchorWindow : function (windowToAnchor){
			console.info('anchor the window');
			var markerId = windowToAnchor.marker.wikiID,
					  me = this;
			
			//delete line from link layer and selection and delete from the absolute layer
			this.unSelectWindow(markerId);
			this.layerResources.detachFromThisContainer(windowToAnchor);
			//add the window to the panel Anchor
			this.panelResources.addWindowResource(windowToAnchor, function(){
				//on ready
				//go to the controler to select marker (need )
				me.freizeMapControler.selectMarker(markerId);
			});
			
			
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
		
		/*
		 * Select if not, unselect if selected 
		 */
		toggleWindow : function(idMarker, mapPosition, frizePosition){
			var indexMarkerSelected = this._indexMarkerSelected(idMarker);
			if(indexMarkerSelected > -1){				
				this.unSelectWindow(idMarker);
			}else{
				this.selectWindow(idMarker, mapPosition, frizePosition);
			}
		},
		
		unSelectWindow : function(idMarker){
			this.layerResources.unSelectWindow(idMarker);
			this.panelResources.unSelectWindow(idMarker);
			this.layerResourceMarkerLink.remove(idMarker);
			var indexMarkerSelected = this._indexMarkerSelected(idMarker);
			this.windowsSelected.splice(indexMarkerSelected, 1);
		},
		
		selectWindow : function(idMarker,positionMarkerMap,positionMarkerFrise){

			var windowSelected = this.panelResources.selectWindow(idMarker);
			
			if(windowSelected == null){
				windowSelected = this.layerResources.selectWindow(idMarker);							
			}
			this.windowsSelected.push(idMarker);
			this.layerResourceMarkerLink.linkToMarkers(windowSelected,positionMarkerMap,positionMarkerFrise);
		
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
