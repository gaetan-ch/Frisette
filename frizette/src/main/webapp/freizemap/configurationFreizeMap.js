window.CONFIG_FREIZE_MAP={
	MAP_CHANGE_BOUND_EVENT_TYPE : 'areaMapZoneChanged',
	
	MAP_RESIZE_PANEL_HEIGHT_EVENT_TYPE : 'panelMapHeightChanged',
	
	TIME_CHANGE_BOUND_EVENT_TYPE : 'timeFrizeZoneChanged',
	
	CLICK_MARKER_MAP_EVENT_TYPE : 'mouseOverMapMarker',
	
	CLICK_MARKER_FRIZE_EVENT_TYPE : 'mouseOverTimeMarker',
	
	/*When an process call te server than more 2 secondes, it is lost */
	//shoiuld be set in correlation with ping, media... 
	TIME_RESET_SERVER_CALL_MS : 2000,
	
	TIME_FRISE_TEMPORISATION_MS : 500,
	
	//TIME_FRISE_DRAG_HANDLE_LAYER_MS : 1000,
	
	completeConfiguration :function (){
		// load some stuff from server
		// >> ping, media...
		
		//check cookies (faster than server)
		
	}
};

window.CONFIG_Z_INDEX={
		 //label fraw on the map
		 LABEL_ON_MARKER_POPULATION: '30',
		//Panel with a handler
		 HANDLER_PANEL: 13000,
		 //handle to move the panel
		 HANDLER:   13100,		 
		 //Canevas wich draw the lines
		 LINK_WITH_RESOURCES: 20000,		 
		 //panel display resources (at the beginning on the left)
		 PANEL_RESOURCES: 15000,
		 // popup dislpay upon the map or the frise and the panel resource 
		 POPUP_RESOURCES: 17000
	};

window.CONFIG_ANIMATION={
		 TIME_MEDIAN: '500',
		 DELAY_PUT_HANDLER: '100'
	};

window.CONFIG_FREIZE_MAP.completeConfiguration();