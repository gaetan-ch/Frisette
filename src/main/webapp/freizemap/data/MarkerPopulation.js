
window.POPULATION_POINT_TYPE_MARKER = 20;

function MarkerPopulation(wikiID,nameSurname,timestamp,birthPlaceURI,resourceUri,longitude,latitude,population) {
	
	Marker.call(this,wikiID,nameSurname,timestamp,birthPlaceURI,resourceUri,longitude,latitude);
	this.type = window.POPULATION_POINT_TYPE_MARKER;
	this.population = population;
};

MarkerPopulation.prototype = new Marker(); 
MarkerPopulation.prototype.constructor = MarkerPopulation;
