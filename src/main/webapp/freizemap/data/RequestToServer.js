/*
 * Date format:  YYYY.MM.DD 
 */

var requestToServerUniqueID=1;

function RequestToServer(originEventP,boundsAreaP,boundTimeP){
	this.boundsArea=boundsAreaP,
	this.boundTime= boundTimeP;
	this.id=requestToServerUniqueID++;	
	this.originEvent = originEventP;
};