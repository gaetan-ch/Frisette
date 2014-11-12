function RemoteServer() {

};

/*
 * called to initialize google map.
 * 
 */
RemoteServer.prototype = {
	initialize : function() {

	},

	loadMarkers : function(requestToServer,successCallBackFunction) {
		
		var bdsArea =requestToServer.boundsArea,
		 boundTime =requestToServer.boundTime,originaleRequestToServer=requestToServer,
		 
		 dataToSend = 'startTime=' + boundTime.start + '&endTime=' + boundTime.end;
		
		if(bdsArea!=null){
			var South_Lat = bdsArea.getSouthWest().lat(),
			 South_Lng = bdsArea.getSouthWest().lng(),
			 North_Lat = bdsArea.getNorthEast().lat(),
			 North_Lng = bdsArea.getNorthEast().lng();
			 dataToSend += '&SO_Lt=' + South_Lat + '&SO_lg=' + South_Lng + '&NE_lt=' + North_Lat
			+ '&North_Lng=' + North_Lng;
		}
		$
				.ajax({
					url : 'EventsAjaxServlet',
					timeout : CONFIG_FREIZE_MAP.TIME_RESET_SERVER_CALL_MS,
					type : "GET",
					data : dataToSend,
					cache : false,
					dataType : "json",
					
					error : function(jqXHR, textStatus, errorThrown) {
						debug.log("loadTimelineData json error:", JSON
								.stringify(jqXHR), JSON.stringify(textStatus),
								errorThrown);
					},

					success : function(events) {

						if (events.error) {
							alert(events.error);
							return false;
						} else {
							//everything is nice
							events.originaleRequestToServer=originaleRequestToServer;
							successCallBackFunction(events);
						}
					}
				});
	}
};