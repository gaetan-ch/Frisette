/*
 * Manage the layout of panel North/South 
 */

function NorthSouthLayoutPanel($divPanelNorth_,$divPanelSouth_){
	var me          = this,
	$divPanelSouth  = $divPanelSouth_,
	$divPanelNorth  = $divPanelNorth_;
	
	$divPanelSouth.positionHandle = NorthSouthLayoutPanel.prototype.MIDDLE_PERCENT;
	$divPanelNorth.positionHandle = NorthSouthLayoutPanel.prototype.MIDDLE_PERCENT;
	
	
	this.southHandle    = new HandlePanel($divPanelSouth,HandlePanel.prototype.POSITION_BOTTOM);	
	this.southHandle.display(); 
	this.northHandle    = new HandlePanel($divPanelNorth,HandlePanel.prototype.POSITION_TOP);
	this.northHandle.display();
		
	//event
	this.southHandle.onClickHandle = function(){
		if($divPanelSouth.positionHandle===NorthSouthLayoutPanel.prototype.HIDE_PERCENT){
			//we put at the middle
			me._position($divPanelSouth,$divPanelNorth,NorthSouthLayoutPanel.prototype.MIDDLE_PERCENT);
		}else{
			//we hide
			me._position($divPanelSouth,$divPanelNorth,NorthSouthLayoutPanel.prototype.HIDE_PERCENT );
		}
	};
	this.northHandle.onClickHandle = function(){
		if($divPanelNorth.positionHandle===this.HIDE_PERCENT){
			//we put at the middle
			me._position($divPanelNorth,$divPanelSouth,me.MIDDLE_PERCENT);
		}else{
			//we hide
			me._position($divPanelNorth,$divPanelSouth,me.HIDE_PERCENT );
		}
	};
}



NorthSouthLayoutPanel.prototype = {
		 HIDE_PERCENT : 0,
		 MIDDLE_PERCENT : 50,
		_position : function($panelFirst,$panelSecond,percentDisplay) {
			
			$panelFirst.positionHandle = percentDisplay;			
			$panelSecond.positionHandle = 100 - percentDisplay;
			
			$panelFirst.animate({height : $panelFirst.positionHandle+'%'},{
				duration :window.CONFIG_ANIMATION.TIME_MEDIAN,
				step: function(number,tween){
					//console.info("hide height :" + $panelFirst.height() + "display height :" + $panelSecond.height() );
						//me.synchroneEventHandler.fire('HEIGHT_CHANGE',number);
					},
				progress: function(promise,progress,remainingMs ){
					//console.info("progress 1");
					}
				}
			);
			
			$panelSecond.animate({height :$panelSecond.positionHandle + '%'},{
				duration :window.CONFIG_ANIMATION.TIME_MEDIAN,
				step: function(number,tween){
					
						//me.synchroneEventHandler.fire('HEIGHT_CHANGE',number);
					},
				progress: function(promise,progress,remainingMs ){
					//console.info("progress 2");
					}
				}
			);
		},

		setNorthHandlePanel : function(handlePanel) {
			this.northHandle = handlePanel;
			return this.northHandle;
		}
		
};
