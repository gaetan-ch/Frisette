

window.POINT_TYPE_MARKER = 2;

function Marker(wikiID,nameSurname,timeStamp,birthPlaceURI,resourceUri,longitude,latitude) {
	
	this.wikiID = wikiID;
	this.nameSurname = nameSurname;
	this.timestamp = timeStamp;
	this.birthPlaceURI = birthPlaceURI;
	this.resourceUri = resourceUri;
	this.latitude = latitude;
	this.longitude = longitude;
	this.type = window.POINT_TYPE_MARKER;
};

Marker.prototype.debugInfo = function() {
	  return 'Birthday ' + this.timeStamp+ ' at ' + this.birthPlaceURI + ' <BR/> ' +  ' Wiki id' + this.wikiID;
};


