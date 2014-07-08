/*
 * Date format:  YYYY.MM.DD 
 */
function BoundTime(startTime, endTime) {
	this.start = startTime, this.end = endTime;
};

BoundTime.prototype = {
	notEqualsBounds : function(boundTimeToCompare) {
		return !(boundTimeToCompare.start === this.start
				&& boundTimeToCompare.end === this.end);
	}
};
