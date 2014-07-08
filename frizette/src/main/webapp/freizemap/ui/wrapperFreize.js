//TimeGlider\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function WrapperFreize() {
	var optionsTimeLauncher={
		caller : this,
		repeat : false,
		reloadTime : CONFIG_FREIZE_MAP.TIME_FRISE_TEMPORISATION_MS	
	};
	this.freize = {},
	this.WIDGET_ID = 'frisePanel',
	this.base_namespace = 'tg',
	this.firstLoaded= true;
	this.lastBoundFired = null;
	this.timeLauncher = new TimeLauncher(optionsTimeLauncher),
	this.subscribeEvents= [".mediator.zoomLevelChange",
	                       ".mediator.ticksArrayChange", //".mediator.refreshSignal"
	                       ".mediator.mousewheelChange",
	                       ".mediator.ticksOffsetChange",
	                       // too much ".mediator.scopeChange",
	                       ".mediator.focusDateChange",
	                       ".mediator.resize"]; 
	this.evenetListenerSuspended = false;
};

/*
 * called to initialize google map.
 * 
 */
WrapperFreize.prototype = {
		
	/*private methode*/	
	_getMediator: function (){
		return $("#" + this.WIDGET_ID).timeline('getMediator');
	},	
		
	initialize : function() {

		var container_name = this.base_namespace + "#" + this.WIDGET_ID, tagFreize;
		var $divMapPanel=$("#"+this.WIDGET_ID);
		// Time liner\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		// call jquery UI, plugin timeline
		tagFreize = $divMapPanel.timeline({
			"min_zoom" : 1,
			"max_zoom" : 55,
			"image_lane_height" : 100,
			"show_centerline" : true,
			"icon_folder" : "timeglider/icons/",
			"data_source" : null,// "EventsAjaxServlet",// "json/idaho.json",
			"show_footer" : true,
			"base_namespace" : this.base_namespace
		});

		this.freize  = tagFreize.data("timeline");
		
		var me = this;
		
		var handle = new HandlePanel($divMapPanel);
		handle.display();		
		handle.onHeightChange(function(heightPercent){
			console.info("yyy");
			$.event.trigger({
				type : CONFIG_FREIZE_MAP.XXXXXXXXXXXXXXXXX,
				heightPercent : heightPercent,
				time : new Date()
			});
		});
		
		
		me._initListener(container_name);	
		
		
		//to delete ....
		timeglider.eventActions = {
			nagavigateTo : function(obj) {
				console.info("Event Navigate to...");
				// event object must have a "navigateTo"
				// element with zoom, then ISO date delimited
				// with a pipe |
				// one can use
				var nav = obj.navigateTo;
				me.freize.goTo(nav.focus_date, nav.zoom_level);

				setTimeout(function() {
					$el = $(".timeglider-timeline-event#" + obj.id);
					$el.find(".timeglider-event-spanner").css({
						"border" : "1px solid green"
					}); // 
				}, 50);
			},

		/*
		 * loadTimeline : function(obj) {
		 * 
		 * tg_actor.loadTimeline(obj.loadTimeline.url, { fn : function(args,
		 * data) { debug.log("data:", data[0]); }, args : "", display : true });
		 *  }
		 */
		};// eventActions

		// timeglider.TG_Mediator;

	},// end initialize function

	_fireBoundChanged : function(){
		var newCurrentBoundTime = this.getBoundTime();
		//console.info('wrapperFreize launch event: ' + new Date().getTime() + " -- " + newCurrentBoundTime.start );
		this.lastBoundFired = newCurrentBoundTime;
		$.event.trigger({
			type : CONFIG_FREIZE_MAP.TIME_CHANGE_BOUND_EVENT_TYPE,
			boundTime : newCurrentBoundTime,
			time : new Date()
		});
		
	},
	
	drawMarkers : function(markers,changeScale) {
		
		//format data to Timeline
		//format data to Timeline
		var dataTimeLine = new Array();
		//dataTimeLine.push('{}');
		//dataTimeLine['id']='101';
		dataTimeLine[0] = {'id':'101','title':'Timeline','initial_zoom':'0','events':new Array()};
		
		$.each(markers, function(index, marker) {

			dataTimeLine[0].events.push({"id":marker.wikiID,"title":marker.nameSurname,"startdate":marker.timestamp,"url":marker.birthPlaceURI,"icon":"triangle_green.png","importance":'45'});
		});
		
		
		this.evenetListenerSuspended = true;
		//var MED = this._getMediator();		
		
		//if(changeScale){
			//this.freize.reloadTimeline(this.WIDGET_ID,data);
			// BAD RE DRAW!!!
			//MED.emptyData();
			if(this.firstLoaded){
				this.freize.loadTimeline(dataTimeLine, {
					display : true
				}, this.firstLoaded);
				this.firstLoaded = false;
			}else{
				var idTimeLine =$('.tg-timeline-start').attr('data-timeline_id');
				this.freize.reloadTimeline(idTimeLine,dataTimeLine);
			}
			//MED.refresh();
		//}
		this.evenetListenerSuspended = false;
	},

	getBoundTime : function() {
		var MED = this._getMediator(),
		scopeFreize= MED.getScope(),
		TG_Date =timeglider.TG_Date,
		leftDateStr,rightDateStr;
		
		//scopeFreize.left_sec is the seondonde from JC trosnform to YYYY.MM.DD
		leftDateStr = TG_Date.getDateFromSec(scopeFreize.left_sec);
		rightDateStr = TG_Date.getDateFromSec(scopeFreize.right_sec);
		//console.info('Time line bound date (YYYY-MM-DD)'+leftDateStr +'-'+ rightDateStr);
		return new BoundTime(leftDateStr,rightDateStr);
	},


	_initListener: function(container_name){
		var me = this;
		$.each(this.subscribeEvents, function(index, value) {
			$.subscribe(container_name + value, function (info) {
				//too much event
				//console.info("Event on timeline occured");
				if(me.evenetListenerSuspended===false){
					me.timeLauncher.launch();
				}
			});
		});
		
		//add event when selected .viewer.eventModal EventInfo
		$.subscribe("clickToOpenResourceWindow", function (infos) {
			//too much event
			//console.info("Event on timeline occured");*
			
			
			$.event.trigger({
				type : CONFIG_FREIZE_MAP.CLICK_MARKER_FRIZE_EVENT_TYPE,
				idMarker : infos.timeline_id,
				time : new Date(),
				position :me._getMiddleAbsolutePositionFromElement($('#'+infos.timeline_id)),
				marker : null
			});
			
		});
		
	},
	
	_getMiddleAbsolutePositionFromElement : function ($tag){
		var centerY = $tag.offset().top + $tag.height()/2;
		var centerX = $tag.offset().left + $tag.width()/2;
		return {left:centerX, top:centerY};
	},
	
	//use by Timer
	_functionToCall : function(){
		this._fireBoundChanged();
	},
	//use by Timer
	_functionShoulBeCalled : function(){
		var newCurrentBoundTime = this.getBoundTime(), launch = false;
		if(this.lastBoundFired===null || this.lastBoundFired.notEqualsBounds(newCurrentBoundTime)){
			launch = true;
		}
		return launch;
	},
	
	getAbsoluteMarkerUIPositionFromId : function(idMarker){
		
		return this._getMiddleAbsolutePositionFromElement($("#" + this.WIDGET_ID).find('#'+idMarker));
		
	}
	
};

