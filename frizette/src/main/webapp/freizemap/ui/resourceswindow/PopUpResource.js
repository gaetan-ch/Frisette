PopUpResource.viewHtml = "<div class='popupResource tg-modal timeglider-ev-modal ui-widget-content ${extra_class}' id='${id}_modal'>"
		+ "<div class='popup-close-button tg-close-button tg-close-button-remove'></div>"
		+ "<div class='popup-anchor-button'>1</div>"
		+ "<div class='popup-title'>${title}</div>"
		+ "<div class='popup-description'><p>{{html image}}{{html description}}</p></div>"
		+ "<ul class='popup-links'>{{html links}}</ul>"
		+ "</div>";

function PopUpResource(marker) {

	// For displaying an exterior page directly in the modal
	/*
	 * window_iframe: "<div class='tg-modal timeglider-ev-modal
	 * ui-widget-content tg-iframe-modal' id='${id}_modal'>" + "<div
	 * class='tg-close-button tg-close-button-remove'></div>" + "<div
	 * class='dateline'>{{html dateline}}</div>" + "<h4 id='title'>{{html
	 * title}}</h4>" + "<iframe frameborder='none' src='${link}'></iframe>" + "</div>" };
	 */
	var viewFinalHTML = new String(PopUpResource.viewHtml);
	viewFinalHTML = viewFinalHTML.replace('${title}', marker.nameSurname)
			.replace('{{html description}}', marker.debugInfo())
			.replace('{{html image}}', '')
			.replace('{{html links}}', '');
	this.$modal = $(viewFinalHTML.toString());
	this.marker = marker;
	this._initListener();

};
PopUpResource.prototype = {
	
	display : function(centerPosition,callbackFunctionWhenDisplay) {
		var top = centerPosition.top - this.$modal.height() / 2,
			left = centerPosition.left- this.$modal.width() / 2;
		this.$modal.css({
			"z-index" : window.CONFIG_Z_INDEX.POPUP_RESOURCES,
			"top" : top,
			"left" : left
		});		
		this.$modal.fadeIn(window.CONFIG_ANIMATION.TIME_MEDIAN*2);
		//this._show(callbackFunctionWhenDisplay);
	},
	/*
	_show : function(callbackFunctionWhenDisplay){
		var me=this;
		this.$modal.fadeIn(window.CONFIG_ANIMATION.TIME_MEDIAN,function (){
			var children = me.$modal.children(), size = children.size();
			
			children.each(function (index, tag) {
				if(index === (size-1)){
					$(tag).fadeIn(window.CONFIG_ANIMATION.TIME_MEDIAN,callbackFunctionWhenDisplay);	
				}else{
					$(tag).fadeIn(window.CONFIG_ANIMATION.TIME_MEDIAN);
				}
			});
		});
	},
	*/	
	setObserversFunction : function (observersFunction){
		
		var $closeButton  = this.$modal.find('.popup-close-button'),
	        $anchorButton = this.$modal.find('.popup-anchor-button'),
	                   me = this;
	
		if($.isFunction(observersFunction.onCloseRequest)){
			$closeButton.on('click',function (){
				observersFunction.onCloseRequest(me);}
			);
		}
		if($.isFunction(observersFunction.onAnchorRequest)){
			$anchorButton.on('click',function (){
				observersFunction.onAnchorRequest(me);
			});
		}
	},
		
	_initListener : function(){
		
	},
	
	
	getJQueryAnchor : function(){
		return this.$modal;
	},
	
	hiddenAnchorButton : function(){
		
		return this.$modal.find('.popup-anchor-button').hide();
	},
	
	getCenterPosition : function(){
		var offset = this.$modal.offset();
		return {
			"top" : offset.top + this.$modal.height() / 2,
			"left" : offset.left + this.$modal.width() / 2
		};
	},
	
	getWidth : function (){
		return this.$modal.width();
	},
	
	getHeight : function (){
		return this.$modal.height();
	},
	
	remove : function (){
		return this.$modal.remove();
	},
	
	css : function(cssOptions){
		this.$modal.css(cssOptions);	
	},
	detach : function(){
		this.$modal.detach();
	},
	resetStyle : function(){
		this.$modal.attr('style','');
	},
	
	select : function (){
		console.info('Select this modal : ' + this.$modal);
	},
	
	unSelect : function (){
		console.info('UnSelect this modal : ' + this.$modal);
	}
	
};
