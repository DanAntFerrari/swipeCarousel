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
	// Animation between panes happens with css transitions
	// ATTENTION! = This Script requires jQuery, Modernizr asset libraries
	// Asset URI: http://jquery.com/ - http://modernizr.com/ - http://eightmedia.github.io/hammer.js/

	;(function($,mzr,doc,win) {

	"use strict"; //catches some common coding problems -http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

	$.swipeCarousel=function(element,options){
		// Carousel option if slide length > 0
		var defaults = {

			slideshow	: {
				state 		: false 	// Default: false 	--> Set true for turn it on
				,timerInt	: 5000		// Default: 5000	--> Set time value (milliseconds)
				,stopLoop	: 3 		// Default: 1 		--> Set number of times (0 for infinite)
			}
			,set	: {
				forRow    	: 1 		// Default: 1 		-->	 Set number of item for row
				,arrow		: false		// Default: false	-->  Set true for turn it on
				,arrowTo	: false		// Default: false	-->  Set CSS selector for turn it on
				,key		: false		// Default: false	-->  Set CSS selector for turn it on
				,spot		: true		// Default: false	-->  Set true for turn it on
				,drag		: true		// Default: true	-->  Set false for turn it off
				,mode    	: "slide" 	// Default: "slide"	-->	 Set mode "fade" or "slide"
				,timeTo    	: 800	 	// Default: 800 	-->	 Set time value (milliseconds)
			}
			,callbacks :{
				onInit 			: null	// Callback function: On slider initialize
				//,onSlide         : null	// Callback function: As the slide starts to animate
				,beforeSet      : null	// Callback function: Before swipeCarousel is set or reset
				,afterSet      	: null	// Callback function: After swipeCarousel is set or reset
				,endSlideshow	: null	// Callback function: After swipeCarousel is set or reset
				//,afterSlide      : null	// Callback function: As the slide completes the animation
				//,onSlideEnd      : null  	// Callback function: Once the slider reaches the last slide
			}
		};

		//	http://css-plus.com/2010/05/adding-user-options-to-your-jquery-plugin/
		//	http://api.jquery.com/jQuery.extend/
		var options = $.extend(true,{},defaults, options);

		// To avoid scope issues, use 'self' instead of 'this'
		// To reference this class from internal events and functions.
		var self = this;

		// Access to jQuery and DOM versions of element
		self.$element = $(element);
		var elementName = $(element).prop('id');
		var element = $(element);

		// Add a reverse reference to the DOM object
		self.$element.data("swipeCarousel", self);

		var container = $(">ul", element);
		var panes = $(">ul>li", element);

		var pane_width = 0;
		var pane_count = panes.length;

		var current_pane = 0;

		var isIE = document.all && document.compatMode;

		var slideTimer;
		var _moving= false;

		// IF slide for row length > 1
		if (options.set.forRow >= 2){
			pane_count = pane_count-(options.set.forRow-1);
			//current_pane = options.set.forRow-1;
		}

		// FOR ARROW POSITION
		if(typeof options.set.arrowTo === 'string'){
			options.set.arrowTo = $(options.set.arrowTo);
		} else {
			options.set.arrowTo = element;
		}

		//console.log('slideShow: '+elementName+' n° slide: '+pane_count+' - options.slideshow.timerInt: '+options.slideshow.timerInt+' - options.slideshow.state: '+options.slideshow.state+' - options.set.state: '+options.set.state)

		//initialization

		this.init=function() {
			self.setPaneDimensions(true);
			// IF slide length > 0
			if (pane_count > 1){
				// INIT NAVIGATION
				self.navigation();
				// INIT SLIDESHOW
				if (options.slideshow.state){
					self.sliderstartTimer();
				}
			}
			//CHECK TAB ACTION
			$(window).on("resize orientationchange", function() {
				clearInterval(slideTimer);
				self.setPaneDimensions(false);

				//updateOffset();
			});
			////IF open nav SGM
			//$('.menu-trigger').on("click", function() {
			//	clearInterval(slideTimer);
			//});
		};


		//set the pane dimensions and scale the container
		this.setPaneDimensions=function(onInitI) {
			// beforeSet callback
			if (options.callbacks.beforeSet!=null && typeof(options.callbacks.beforeSet ) == 'function' ) options.callbacks.afterSet(self);

			container.add('.carousel .nav, .carousel .indicators').addClass('invisible');
			element.addClass('js-loading');
			//var panesHeight = (panes.height())+'px';
			pane_width = (element.innerWidth())/options.set.forRow;
			panes.width(pane_width);
			var container_width = pane_width*(pane_count);
			if (options.set.forRow >= 2 && options.set.mode == "slide"){
				//container_width = Math.round(pane_width*(pane_count+(options.set.forRow-1)));
				container_width = (pane_width*(pane_count+(options.set.forRow-1)))+1;
				if(element.width()>=container_width){
					container_width=element.width;
				}
			} else if (options.set.mode == "fade"){
				container_width=element.width;
				panes.hide();
			}

			if(options.set.spot){
				// center pointers in page:
				var leftMargin = element.find('.indicators').outerWidth() / 2 ;
				element.find('.indicators').css('margin-left',-leftMargin+'px');
			}
			if(options.set.spot){
				// center pointers in page:
				var leftMargin = element.find('.indicators').outerWidth() / 2 ;
				element.find('.indicators').css('margin-left',-leftMargin+'px');
			}

			container.animate({
					width:container_width
				}, 0, function() {
					// math complete.
					element.removeClass('js-loading');
					container.add('.carousel .nav, .carousel .indicators').delay(100).removeClass('invisible');

					if (onInitI){
						if (options.set.forRow >= 2){
							panes.slice(0,(0+options.set.forRow)).fadeIn(options.set.timeTo);
						} else{
							panes.eq(0).fadeIn(options.set.timeTo);
						}
						onInitI=false;
						// onInit callback
						if (options.callbacks.onInit!=null && typeof(options.callbacks.onInit ) == 'function' ) options.callbacks.onInit(self);

					} else {
						self.goToIndex(current_pane);
					}
					// afterSet callback
					if (options.callbacks.afterSet!=null && typeof(options.callbacks.afterSet ) == 'function' ) options.callbacks.afterSet(self);
				}
			);

		};	// self.setPaneDimensions();


		this.navigation=function() {
			if(options.set.arrow || options.set.key || options.set.spot)options.set.arrowTo.addClass('withnav');

			if(options.set.arrow){

				var left = "<a class='nav prev hidden' rel='prev' href='javascript:void(0);'> <span aria-hidden='true' class='icon-arrow-left'></span></a>";
				var right = "<a class='nav next' rel='next' href='javascript:void(0);'><span aria-hidden='true' class='icon-arrow-right'></span></a>";

				$(right).appendTo(options.set.arrowTo);
				$(left).prependTo(options.set.arrowTo);
				//CLICK ON ARROW
				options.set.arrowTo.on('click','.nav',function(e,simulated){
					if(!simulated){
						//console.log('click on nav SO: stop slideshow')
						clearInterval(slideTimer);	// A real click occured. Cancel the auto advance animation.
					}
					if($(this).hasClass('prev')){
						self.prev();
					} else {
						self.next();
					}
				});

			}
			if(options.set.key){
				//element.on(
				//mouseEnter: function(e){
				//	console.log('eccoci');
				//	element.bind().keyup( function (e) {
				//		if ( e.keyCode == 39 ) { // Right arrow
				//			self.next();
				//			return false;
				//		} else if ( e.keyCode == 37 ) { // Left arrow
				//			self.prev();
				//			return false;
				//		}; // e.keyCode
				//	}); // window.keyup
				//});
			}

			if(options.set.spot){

				var indicators = "<ul class='indicators'>";

				//check how many steps we need
				for (var i=0;i<pane_count;i++) {
					$(this).data('ind','ind_'+i);
					indicators +=  '<li class="spot" data-index="'+i+'"><a href="javascript:void(0);"></a></li>';
				}


				indicators += "</ul>";
				$(indicators).appendTo(element);



				element.find('.indicators li:eq(0)').addClass('active');

				//CLICK ON INDICATORS SPOT
				element.on('click','.spot',function(e,simulated){
					if(!simulated){
						//console.log('click on spot SO: stop slideshow')
						clearInterval(slideTimer);	// A real click occured. Cancel the auto advance animation.
					}
					var item = $(this).data('index');
					//console.log('current_pane: '+current_pane+' index: '+item);
					console.log(_moving)
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

			if (slideCounter < pane_count){
				slideTimer = setInterval(function() {
					//console.log('slideShow di: '+elementName+' n° slide: '+i_slide+' n° loop: '+i_loop+'/'+options.slideshow.stopLoop+' slideCounter: '+slideCounter+' pane_count: '+pane_count)
					if (slideCounter==pane_count) {
						self.goToIndex(0);
						if(options.slideshow.stopLoop==i_loop){
							//console.log('fine')
							clearInterval(slideTimer);
							if (options.callbacks.endSlideshow!=null && typeof(options.callbacks.endSlideshow ) == 'function' ) options.callbacks.endSlideshow(self);
						} else {
							//console.log('ancora');
							slideCounter = 1;
						}
						i_loop++
					} else {
						self.goToIndex(slideCounter);
						slideCounter++;
					}
					i_slide++ // loop number index
				}, options.slideshow.timerInt);
			}
		}; // self.sliderstartTimer();

		//show pane by index
		this.showPane=function(index,animate) {
			//console.log('showPane',_moving)
			// between the bounds
			index = Math.max(0, Math.min(index,pane_count-1));
			if(options.set.mode == "fade") {
				//console.log(current_pane,index);
				var old_current_pane = current_pane;
				if (options.set.forRow >= 2){
					panes.stop();
					panes.slice(old_current_pane,(old_current_pane+options.set.forRow)).hide();
					element.find('.indicators li:eq('+(index)+')').addClass('active');
					panes.slice(index,(index+options.set.forRow)).fadeIn(options.set.timeTo,function(){
						current_pane = index;
						_moving = false;
					});
				} else{
					panes.stop();
					panes.hide();
					element.find('.indicators li:eq('+(index)+')').addClass('active');
					panes.eq(index).fadeIn(options.set.timeTo,function(){
						current_pane = index;
						_moving = false;
					});
				}
			}
			else {
				// mode slide
				current_pane = index;
				var offset = -((100/pane_count)*current_pane);
				setContainerOffset(offset, true);
				element.find('.indicators li:eq('+(current_pane)+')').addClass('active');
			}
		};	// self.showPane();


		function setContainerOffset(percent, animate) {
			container.removeClass("animate");

			if(animate) {
				container.addClass("animate");
			}
			if (Modernizr.csstransforms3d) {
				//container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
				var px = ((pane_width*pane_count) / 100) * percent;
				container.css("transform", 'translate3d('+px+'px,0,0) scale3d(1,1,1)');
			}
			else if (Modernizr.csstransforms) {
				//container.css("transform", "translate("+ percent +"%,0)");
				var px = ((pane_width*pane_count) / 100) * percent;
				container.css("transform", "translate("+px+"px,0)");
			}
			else {
				var px = ((pane_width*pane_count) / 100) * percent;
				if (TweenMax)TweenMax.to(container, 0.3, {css:{marginLeft:px}, ease:Expo.easeOut});
				else container.animate({marginLeft:px},600);
			}
		}

		this.next=function() {
			//console.log('next '+current_pane);
			self.updatenav(current_pane,'next');
			return this.showPane(current_pane+1, true);
		};	// self.next();

		this.prev=function() {
			//console.log('prev '+current_pane);
			self.updatenav(current_pane,'prev');
			return this.showPane(current_pane-1, true);
		};	// self.prev();

		this.goToIndex=function(index) {
			//console.log('slideShow: prev '+current_pane);
			self.updatenav(current_pane,index);
			return this.showPane(index, true);
		};	// self.prev();

		this.updatenav=function(index,direction) {
			options.set.arrowTo.find('.nav').removeClass('hidden');
			element.find('.indicators li').removeClass('active');

			switch(direction) {
				case 'prev':
					//console.log('slideShow: move to / prev - current_pane: '+current_pane+' - pane_count: '+pane_count);
					if(current_pane<=1){
						options.set.arrowTo.find('.prev').addClass('hidden');
					}
					//element.find('.indicators li:eq('+(current_pane+1)+')').addClass('active');
				break;
				case 'next':
					//console.log(slideShow:  move to / prev - next: '+current_pane+' - pane_count: '+pane_count);
					if(current_pane>=(pane_count-2)){
						options.set.arrowTo.find('.next').addClass('hidden');
					}

				break;
				default:
					//console.log(slideShow:  move to / RIC current_pane: '+current_pane+' index: '+direction+' pane_count: '+pane_count);
					if(direction==0){
						options.set.arrowTo.find('.prev').addClass('hidden');
					} else if (direction==(pane_count-1)){
						options.set.arrowTo.find('.next').addClass('hidden');

					}
				break;
			}
		};	// self.updatenav();

		function handleHammer(ev,simulated) {

			if(!simulated){
				//console.log('action release dragleft dragright swipeleft swiperight SO: stop slideshow')
				clearInterval(slideTimer);	// A real click occured. Cancel the auto advance animation.
			}


			switch(ev.type) {
				case 'dragright':
				case 'dragleft':
					ev.gesture.preventDefault();

					if(options.set.mode != "fade") {
						// stick to the finger
						var pane_offset = -(100/pane_count)*current_pane;
						var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

						// slow down at the first and last pane
						if((current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
							(current_pane == pane_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
							drag_offset *= .4;
						}

						setContainerOffset(drag_offset + pane_offset);

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
					if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
						if(ev.gesture.direction == 'right') {
							self.prev();
						} else {
							self.next();
						}
					}
					else {
						self.showPane(current_pane, true);
					}
				break;
			}


		}
		// IF slide length > 0
		this.init();
		if (pane_count > 1 && options.set.drag && Hammer){
			// no swype on windows mobile
			if(!isIE) {
			//if(!isIE && Modernizr.touch) {
				element.hammer().on("release dragleft dragright swipeleft swiperight", handleHammer);
			}
		};

	}; // $.swipeCarousel


	$.fn.swipeCarousel=function(options){

		return this.each(function(){
			(new $.swipeCarousel(this,options));
			// Our plugin so far if ( $.isFunction( settings.complete ) ){ settings.complete.call( this ); }
		}); // this.each

	}; // $.fn.swipeCarousel

	// This function breaks the chain, but returns
	// the wip.carousel if it has been attached to the object.
	$.fn.getcasio_carousel = function(){
		this.data("swipeCarousel");
	};


})(jQuery,Modernizr, document, window);

