/*
 * Entry point for the frise, launch de controler  
 * 
 */


// initial declaration of timeglider object for widget
// authoring app will declare a different object, so
// this will defer to window.timeglider
timeglider = window.timeglider || {mode:"publish", version:"0.1.0", ui:{touchtesting:false}};

freizeMapControler =  window.freizeMapControler || {mode:"publish", version:"0.0.1", ui:{touchtesting:true}};

//called on window loaded
/*controlerFreizeMap.initialize = function(){
	controlerFreizeMap.wrapperMap.initialize();
	controlerFreizeMap.wrapperFreize.initialize();
}; */
//Go on
$(function(){
	freizeMapControler = new FreizeMapControler();
	freizeMapControler.initialize();
	
}); 