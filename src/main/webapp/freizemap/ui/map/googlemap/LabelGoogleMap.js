
LabelGoogleMap.viewHtml='<div class=\'populationMaker\'></div>';

/** @constructor */
function LabelGoogleMap(bounds, text, map) {
  
  // Now initialize all properties.
  this.bounds = bounds;
  this.text = text;
  this.map = map;

  // Define a property to hold the image's div. We'll
  // actually create this div upon receipt of the onAdd()
  // method so we'll leave it null for now.
  this.$div = null;

  // Explicitly call setMap on this overlay
  this.setMap(map);
};

LabelGoogleMap.prototype = new google.maps.OverlayView();

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */

LabelGoogleMap.prototype.onAdd = function() {
  
  
  // Create the img element and attach it to the div.
  var $divText =$(LabelGoogleMap.viewHtml); 
  $divText.css('z-index',  window.CONFIG_Z_INDEX.LABEL_ON_MARKER_POPULATION);
  
  $divText.append(this.text);
  
  
  this.$div = $divText;

  // Add the element to the "overlayImage" pane.
  var panes = this.getPanes();
  panes.overlayLayer.appendChild($divText.get(0));
};

LabelGoogleMap.prototype.draw = function() {
 
  var overlayProjection = this.getProjection(),
   northEast = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast()),
   southWest = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest()),
   centerPosition = overlayProjection.fromLatLngToDivPixel(this.bounds.getCenter());
  
  var width = northEast.x -southWest.x,
   fontSize = width/2,
   top = centerPosition.y - fontSize/2;

  this.$div.css('top',   top );
  this.$div.css('left',  (centerPosition.x - width/2));
  this.$div.css('width',  width);
  this.$div.css('font-size',fontSize);
  this.$div.show();
};

LabelGoogleMap.prototype.onRemove = function() {
  this.setMap(null);
  this.$div.remove();
  this.$div = null;
};
