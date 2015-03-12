/* =========================================================
 * [carousel.js]
 * Project:         swipeCarousel_1.0.0
 * Description:     javascript assets
 * Last change:     20/06/2013
 * Copyright:       2013 Wip Italia S.r.l.
 * Author:          Daniele Antonio Ferrari
 * Author URI:      http://www.wipitalia.it/
 * ========================================================= *
 *  I suggest to minify before import this script
 * ========================================================= */

	// Super simple carousel
	// Animation between self.$panes happens with css transitions
	// ATTENTION! = This Script requires jQuery, Modernizr asset libraries
	// Asset URI:
	//	http://jquery.com/
	//	http://modernizr.com/
	//	http://eightmedia.github.io/hammer.js/

	;(function($,mzr,doc,win) {

	"use strict"; //catches some common coding problems -http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

	$.swipeCarousel=function(ele,options){

		if ('undefined' === typeof ele)	throw new Error('You must give an self.$ele');
		// To avoid scope issues, use 'self' instead of 'this'
		// To reference this class from internal events and functions.
		var self = {};
		self.__class__ = 'swipeCarousel';
		self.__version__ = '2.0.0';

		// Access to jQuery and DOM versions of element
		self.$ele = $(ele);

		// Add a reverse reference to the DOM object
		self.$ele.data("swipeCarousel", self.$ele);

		// Add a reverse reference to the DOM object
		//self.$ele.data("swipeCarousel-data", self);

		// Carousel defaults options
		self.defaults={
			slideshow:{
				state 			:	false		// Default: false 	--> Set true for turn it on
				,timerInt		:	5000		// Default: 5000	--> Set time value (milliseconds)
				,stopLoop		:	3 			// Default: 1 		--> Set number of times (0 for infinite)
			}
			,set:{
				forRow			:	1			// Default: 1 		-->	 Set number of item for row
				,arrow			:	false		// Default: false	-->  Set true for turn it on
				,arrowTo		:	false		// Default: false	-->  Set CSS selector for turn it on
				,key			:	true		// Default: false	-->   Set true for turn it on
				,spot			:	false		// Default: false	-->  Set true for turn it on
				,spotTo			:	false		// Default: false	-->  Set CSS selector for turn it on
				,drag			:	true		// Default: true	-->  Set false for turn it off
				,gap			:	1			// Default: 1	-->  Set number of gap
				,mode			:	"slide"		// Default: "slide"	-->	 Set mode "fade" or "slide"
				,timeTo			:	800			// Default: 800 	-->	 Set time value (milliseconds)
				,resize			:	true		// Default: false	-->  Set true for turn it on
			}
			,callbacks:{
				onInit 			:	null		// Callback function: On slider initialize
				//,onSlide		:	null		// Callback function: As the slide starts to animate
				,beforeSet		:	null		// Callback function: Before swipeCarousel is set or reset
				,afterSet		:	null		// Callback function: After swipeCarousel is set or reset
				,endSlideshow	:	null		// Callback function: After swipeCarousel is set or reset
				//,afterSlide	:	null		// Callback function: As the slide completes the animation
				//,onSlideEnd	:	null		// Callback function: Once the slider reaches the last slide
			}
		};

		//-----------------------------------------------------------------------------
		//	reference about create jquery plugin option:
		//	http://css-plus.com/2010/05/adding-user-options-to-your-jquery-plugin/
		//	http://api.jquery.com/jQuery.extend/
		//-----------------------------------------------------------------------------

		self.opt = $.extend(true,{},self.defaults, options);


			self.$container =	$(">ul", self.$ele);
			self.$panes 	=	$(">ul>li", self.$ele);

		var	$win			=	$(win);
		var _paneWidth		=	0;
		var _paneHeight		=	0;
		var _paneCount		=	self.$panes.length;
		var _currentPane	=	0;
		var _isIE			=	document.all && document.compatMode;
		var _slideTimer		=	null;
		var _moving			=	false;

		// check how many steps we need
		var _indicatorsNum  = _paneCount;
		if (self.opt.set.forRow >= 2) _indicatorsNum = _indicatorsNum-(self.opt.set.forRow-1);

		// set arrow container
		if(self.opt.set.arrow == true && typeof self.opt.set.arrowTo === 'string')	self.opt.set.arrowTo = self.$ele.parents(self.opt.set.arrowTo);
		else if(!(self.opt.set.arrowTo instanceof $)) self.opt.set.arrowTo = self.$ele;

		// set spot container
		if(self.opt.set.spot == true && typeof self.opt.set.spotTo === 'string' )	self.opt.set.spotTo = self.$ele.parents(self.opt.set.spotTo);
		else if(!(self.opt.set.spotTo instanceof $)) self.opt.set.spotTo = self.$ele;

		//function destroy(){
		//	elem.removeClass('jspScrollable').unbind('.jsp');
		//	elem.replaceWith(originalself.$ele.append(pane.children()));
		//	originalself.$ele.scrollTop(currentY);
		//	originalself.$ele.scrollLeft(currentX);
//
//		//	// clear reinitialize timer if active
//		//	if (_slideTimer) clearInterval(_slideTimer);
		//}

		//set the pane dimensions and scale the self.$container
		self.setPaneDimensions=function(onInitI) {

			// If beforeSet callback
			if (self.opt.callbacks.beforeSet!=null && typeof(self.opt.callbacks.beforeSet ) == 'function' ) self.opt.callbacks.afterSet(self);

			//hide element during setting
			self.$container.addClass('hidden');
			if(self.opt.set.arrow && self.$navArrow)self.$navArrow.addClass('invisible');
			if(self.opt.set.spot && self.$indicators)self.$indicators.addClass('invisible');
			self.$ele.addClass('js-loading');
			//var self.$panesHeight = (self.$panes.height())+'px';

			//reset initial width
			self.$ele.removeAttr( 'style');

			//set  pane width rounded to at most 4 decimal
			_paneWidth = Math.ceil((self.$ele.innerWidth())/self.opt.set.forRow * 10000)/10000;
			//not necessary _paneHeight = self.$ele.innerHeight();
			self.$panes.width(_paneWidth);
			var _containerWidth = _paneWidth*(_paneCount);

			// DA RIVEDERSI
			if (self.opt.set.mode == "fade"){
				self.panesHeight	=	self.$panes.height();
				_containerWidth		=	self.$ele.width;
				self.$panes.hide();
				self.$panes.css({
					position:"absolute"
					,top:0
					,left:0
				});
				self.$container.height(self.panesHeight);
			}


			self.$panes.eq(_currentPane).addClass('active');
			if(_currentPane!=0)self.$panes.eq(_currentPane-1).addClass('prev');
			self.$panes.eq(_currentPane+1).addClass('next');

			if(self.opt.set.spot && self.$indicators){
				// center pointers in page:
				var leftMargin = self.$indicators.outerWidth() / 2 ;
				self.$indicators.css('margin-left',-leftMargin+'px');
			}
			//console.log(_containerWidth)
			self.$ele.animate({
				width:self.$ele.innerWidth()
			}, 0, function() {
				self.$container.animate({
						width:_containerWidth
					}, 0, function() {
						// math complete.
						self.$ele.removeClass('js-loading');
						if(self.opt.set.arrow && self.$navArrow)self.$navArrow.removeClass('invisible');
						if(self.opt.set.spot && self.$indicators)self.$indicators.removeClass('invisible');
						self.$container.delay(100).removeClass('hidden');

						if (onInitI){
							if (self.opt.set.forRow >= 2){
								self.$panes.slice(0,(0+self.opt.set.forRow)).fadeIn(self.opt.set.timeTo);
							}
							else{
								self.$panes.eq(0).fadeIn(self.opt.set.timeTo);
							}
							onInitI=false;
							// onInit callback
							if (self.opt.callbacks.onInit!=null && typeof(self.opt.callbacks.onInit ) == 'function' ) self.opt.callbacks.onInit(self);


						}
						else {
							self.goToIndex(_currentPane);
						}
						// afterSet callback
						if (self.opt.callbacks.afterSet!=null && typeof(self.opt.callbacks.afterSet ) == 'function' ) self.opt.callbacks.afterSet(self);
					}
				);

			});
/*
*/

		};	// self.setPaneDimensions();


		self.navigation=function() {
			if(self.opt.set.arrow || self.opt.set.key || self.opt.set.spot)self.opt.set.arrowTo.addClass('withnav');

			if(self.opt.set.arrow){
				var left = "<a class='disabled nav-arrow prev disable' disabled='disabled' rel='prev' href='javascript:void(0);'> <span aria-hidden='true' class='icon-arrow-left'></span></a>";
				var right = "<a class='nav-arrow next' rel='next' href='javascript:void(0);'><span aria-hidden='true' class='icon-arrow-right'></span></a>";

				$(right).appendTo(self.opt.set.arrowTo);
				$(left).prependTo(self.opt.set.arrowTo);


				self.$navArrow = self.opt.set.arrowTo.find('.nav-arrow');
				//self.$navArrow = .find('.prev')
				self.$navArrowNext = self.opt.set.arrowTo.find('.next');
				self.$navArrowPrev = self.opt.set.arrowTo.find('.prev');

				//CLICK ON ARROW
				self.opt.set.arrowTo.on('click','.nav-arrow',function(e,simulated){
					if(!simulated){
						//console.log('click on nav SO: stop slideshow')
						clearInterval(_slideTimer);	// A real click occured. Cancel the auto advance animation.
					}
					if($(this).hasClass('prev')){
						self.prev();
					}
					else {
						self.next();
					}
				});

			}
			/*
			if(self.opt.set.key){
				self.$ele.hover(
				mouseEnter: function(e){
					console.log('eccoci');
					self.$ele.bind().keyup( function (e) {
						if ( e.keyCode == 39 ) { // Right arrow
							self.next();
							return false;
						}
						else if ( e.keyCode == 37 ) { // Left arrow
							self.prev();
							return false;
						}; // e.keyCode
					}); // window.keyup
				});
				console.log('asdas')
				self.$ele.on('keyup',function (e) {
					var tag = e.target.tagName.toLowerCase();
					console.log(e);
					if(tag != 'input' && tag != 'textarea'  && tag != 'select'){
						switch(e.keyCode) {
							case 39 : // Right arrow
								self.next();
								return false;
							case 37 : // Left arrow
								self.prev();
								return false;
							break;
						}
					}
				});
			}
			*/

			if(self.opt.set.spot){

				var indicatorsHtml = "<ul class='indicators'>";

				//check how many steps we need
				for (var i=0;i<_indicatorsNum;i++) {
					$(this).data('ind','ind_'+i);
					indicatorsHtml +=  '<li class="spot" data-index="'+i+'"><a href="javascript:void(0);"></a></li>';
				}


				indicatorsHtml += "</ul>";
				$(indicatorsHtml).appendTo(self.opt.set.spotTo);

				self.$indicators = self.opt.set.spotTo.find('.indicators');
				self.$indicatorSpot = self.opt.set.spotTo.find('.indicators li');

				self.$indicatorSpot.eq(_currentPane).addClass('active');

				//CLICK ON INDICATORS SPOT
				self.opt.set.spotTo.on('click','.spot',function(e,simulated){
					if(!simulated){
						//console.log('click on spot SO: stop slideshow')
						clearInterval(_slideTimer);	// A real click occured. Cancel the auto advance animation.
					}
					var item = $(this).data('index');
					//console.log('_currentPane: '+_currentPane+' index: '+item);

					if (_moving==false){
						self.goToIndex(item);
					}
				});

			}


		}; // self.navigation();


		self.sliderstartTimer=function() {

			// source http://tutorialzine.com/2011/01/how-to-make-auto-advancing-slideshows/
			var	slideCounter = 1,
				i_slide = 1,
				i_loop = 1;

			if (slideCounter < _paneCount){
				_slideTimer = setInterval(function() {
					//console.log('slideShow di: '+self.$eleName+' n° slide: '+i_slide+' n° loop: '+i_loop+'/'+self.opt.slideshow.stopLoop+' slideCounter: '+slideCounter+' _paneCount: '+_paneCount)
					if (slideCounter==_paneCount) {
						self.goToIndex(0);
						if(self.opt.slideshow.stopLoop==i_loop){
							//console.log('fine')
							clearInterval(_slideTimer);
							if (self.opt.callbacks.endSlideshow!=null && typeof(self.opt.callbacks.endSlideshow ) == 'function' ) self.opt.callbacks.endSlideshow(self);
						}
						else {
							//console.log('ancora');
							slideCounter = 1;
						}
						i_loop++
					}
					else {
						self.goToIndex(slideCounter);
						slideCounter++;
					}
					i_slide++ // loop number index
				}, self.opt.slideshow.timerInt);
			}
		}; // self.sliderstartTimer();

		//show pane by index
		self.showPane=function(index,animate) {
			//console.log('showPane',_moving)
			// between the bounds
			index = Math.max(0, Math.min(index,_paneCount-1));
			if(self.opt.set.mode == "fade") {
				//console.log(_currentPane,index);
				var old__currentPane = _currentPane;
				if (self.opt.set.forRow >= 2){
					self.$panes.stop();
					self.$panes.slice(old__currentPane,(old__currentPane+self.opt.set.forRow)).hide();
					self.$indicatorSpot.eq(index).addClass('active');
					self.$panes.slice(index,(index+self.opt.set.forRow)).fadeIn(self.opt.set.timeTo,function(){
						_currentPane = index;
						_moving = false;
					});
				}
				else{
					self.$panes.stop();
					self.$panes.hide();
					self.$indicatorSpot.eq(index).addClass('active');
					self.$panes.eq(index).fadeIn(self.opt.set.timeTo,function(){
						_currentPane = index;
						_moving = false;
					});
				}
			}
			else {
				_currentPane = index;
				var offset = -((100/_paneCount)*_currentPane);
				//ESEMPIO CALCOLO LASTGAP
				/*
					// n totale item / numero delle colonne per ottenere l'avanzo
					var nGap = itemL/nCol
					// nseparo l'avanzo (restante item) dall'intero
					nGap = nGap - Math.floor(nGap);
					if(nGap==0){
						nGap=null;
					}else{
						// rapporto degli spazi vuoti sul toale del contenitore
						nGap = (100/i) * (nCol - Math.floor(nGap*nCol));
						// rarrotondo per bellezza ed ie8
						nGap = nGap.toFixed(5);
					}
				*/
				//sottraggo all'offset la precentuale di spazio che non voglio mostrare dell'ultimo pannello sul totale della maschera
				if((self.opt.set.lastgap != null) && ((index+1)>= _paneCount)) {
					console.log("ultimo",offset,self.opt.set.lastgap);
					offset = offset+Number(self.opt.set.lastgap);
				}

				setContainerOffset(offset, true);
				self.$panes.eq(_currentPane).addClass('active');
				if(_currentPane!=0)self.$panes.eq(_currentPane-1).addClass('prev');
				self.$panes.eq(_currentPane+1).addClass('next');
				if(self.$indicatorSpot)	self.$indicatorSpot.eq(_currentPane).addClass('active');
			}
		};	// self.showPane();


		function setContainerOffset(percent, animate) {
			self.$container.removeClass("animate");
			self.opt.set.arrowTo.removeClass("animate");

			if(animate) {
				self.$container.addClass("animate");
				self.opt.set.arrowTo.addClass("animate");
			}
			if (!_isIE && Modernizr.csstransforms3d) {
				self.$container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
				//var px = ((_paneWidth*_paneCount) / 100) * percent;
				//self.$container.css("transform", 'translate3d('+px+'px,0,0) scale3d(1,1,1)');
			}
			else if (!_isIE && Modernizr.csstransforms) {
				self.$container.css("transform", "translate("+ percent +"%,0)");
				//var px = ((_paneWidth*_paneCount) / 100) * percent;
				//self.$container.css("transform", "translate("+px+"px,0)");
			}
			else {
				var px = ((_paneWidth*_paneCount) / 100) * percent;
				if (TweenMax)TweenMax.to(self.$container, 0.8, {css:{marginLeft:px}, ease:Expo.easeOut});
				else self.$container.animate({marginLeft:px},800);
			}
		}

		self.next=function() {
			//console.log('next '+_currentPane);
			self.updatenav(_currentPane,'next');
			if(_currentPane<(_indicatorsNum-1)){
				return self.showPane(_currentPane+1, true);
			}
		};	// self.next();

		self.prev=function() {
			//console.log('prev '+_currentPane);
			self.updatenav(_currentPane,'prev');
			if(_currentPane>0){
				return self.showPane(_currentPane-1, true);
			}
		};	// self.prev();

		self.goToIndex=function(index) {
			//console.log('slideShow: prev '+_currentPane);
			self.updatenav(_currentPane,index);
			return self.showPane(index, true);
		};	// self.prev();

		self.updatenav=function(index,direction) {
			if(self.opt.set.arrow && self.$navArrow)self.$navArrow.removeClass('disabled').removeAttr('disabled');
			if(self.opt.set.spot && self.$indicatorSpot)self.$indicatorSpot.removeClass('active');
			self.$panes.eq(_currentPane).removeClass('active');
			self.$panes.removeClass('prev next');

			switch(direction) {
				case 'prev':
					if(_currentPane<=1){
						if(self.opt.set.arrow)self.$navArrowPrev.addClass('disabled').attr('disabled','disabled');
					}
				break;
				case 'next':
					if(_currentPane>=(_indicatorsNum-1) && self.opt.set.arrow){
						self.$navArrowNext.addClass('disabled').attr('disabled','disabled');
					}

				break;
				default:
					if(direction==0){
						if(self.opt.set.arrow)self.$navArrowPrev.addClass('disabled').attr('disabled','disabled');
					}
					else if (direction==(_paneCount-1)){
						if(self.opt.set.arrow)self.$navArrowNext.addClass('disabled').attr('disabled','disabled');

					}
				break;
			}
		};	// self.updatenav();

		function handleHammer(ev,simulated) {

			if(!simulated){
				//console.log('action release dragleft dragright swipeleft swiperight SO: stop slideshow')
				clearInterval(_slideTimer);	// A real click occured. Cancel the auto advance animation.
			}
			switch(ev.type) {
				case 'dragright':
				case 'dragleft':
					ev.gesture.preventDefault();

					if(self.opt.set.mode != "fade") {
						// stick to the finger

						if((_currentPane != 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) || (_currentPane != _indicatorsNum-1 == ev.gesture.direction == Hammer.DIRECTION_LEFT)){
							var pane_offset = -(100/_paneCount)*_currentPane;
							var drag_offset = ((100/_paneWidth)*ev.gesture.deltaX) / _paneCount;
							//console.log(pane_offset,drag_offset,ev.gesture.deltaX,_paneWidth,pane_offset-drag_offset)
							// slow down at the first and last pane
							if((_currentPane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
								(_currentPane == _indicatorsNum-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
								drag_offset *= .4;
							}
							if(ev.gesture.deltaX <= _paneWidth && ev.gesture.direction == Hammer.DIRECTION_RIGHT || (ev.gesture.deltaX >= (-_paneWidth)) && ev.gesture.direction == Hammer.DIRECTION_LEFT){
								setContainerOffset(drag_offset + pane_offset);
							}
						}
					}
				break;

				case 'swipeleft':
					ev.gesture.preventDefault();
					self.next();
					ev.gesture.stopDetect();
				break;

				case 'swiperight':
					ev.gesture.preventDefault();
					self.prev();
					ev.gesture.stopDetect();
				break;

				case 'release':
					// more then 50% moved, navigate
					if(Math.abs(ev.gesture.deltaX) > _paneWidth/2) {
						if(ev.gesture.direction == 'right') {
							self.prev();
						}
						else {
							self.next();
						}
					}
					else {
						self.showPane(_currentPane, true);
					}

					//add a vertical swype controller
					var h = $('body').scrollTop();
					var hgap = ev.gesture.deltaY;
					if(ev.gesture.direction == 'up' || ev.gesture.direction == 'down' ) {
						$('html,body').animate({scrollTop:h-(hgap*3)}, '500');
					}

				break;
			}

		}

		//initialization
		self.init=function() {
			// if slide length > 0 init navigation
			if (_paneCount > self.opt.set.forRow) self.navigation();
			else self.opt.set.arrow = self.opt.set.arrow = false;
			//set dimensions
			self.setPaneDimensions(true);

			//init auto slider
			if (_paneCount > self.opt.set.forRow &&self.opt.slideshow.state) self.sliderstartTimer();
			//CHECK TAB ACTION
			if(self.opt.set.resize){
				$win.on("resize orientationchange", function() {
					clearInterval(_slideTimer);
					self.setPaneDimensions(false);
					//updateOffset();
				});
			}
		};


		self.init();
		// If slides length > self.opt.set.forRow	if drag on and no IE
		if (_paneCount > self.opt.set.forRow && self.opt.set.drag && Hammer && !_isIE) {
			self.$ele.hammer().on("release dragleft dragright swipeleft swiperight", handleHammer);
		};

		return self;
	}; // $.swipeCarousel


	$.fn.swipeCarousel=function(options){
		return this.each(function(){
			(new $.swipeCarousel(this,options));
			// Our plugin so far if ( $.isFunction( settings.complete ) ){ settings.complete.call( this ); }
		}); // this.each

	}; // $.fn.swipeCarousel

	// This function breaks the chain, but returns
	// the wip.carousel if it has been attached to the object.
	//$.fn.getcasio_carousel = function(){
	//	this.data("swipeCarousel");
	//};


})(jQuery,Modernizr, document, window);



