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
	// ATTENTION! = This Script need jquery, modernizr and asset libraries
	// Asset URI: http://jquery.com/ - http://modernizr.com/ - http://eightmedia.github.io/hammer.js/

	;(function($,doc,win) {

	"use strict"; //catches some common coding problems -http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

	$.swipeCarosel=function(element,options){

		// Carousel option if slide length > 0
		var defaults = {

			slideshow	: {
					state 		: false, 	// Default: false 	--> Set true for turn it on
					timerInt	: 5000,		// Default: 5000	--> Set time value (milliseconds)
					stopLoop	: 3 		// Default: 1 		--> Set number of times (0 for infinite)
				}
			,nav	: {
					state		: true,		// Default: true	-->  Set true for turn it off
					arrow		: true,		// Default: true	-->  Set true for turn it off
					keyArrow	: false,	// Default: false	-->  Set true for turn it on
					spot		: true		// Default: true	-->  Set true for turn it off
				}
			,item	:{
					forRow    	: 1 		// Default: 1 		--> Set number of item for row
				}
			/*,callbacks :{
				onInit 			: null, 	// Callback function: On slider initialize
		        onSlide         : null, 	// Callback function: As the slide starts to animate
		        afterSlide      : null, 	// Callback function: As the slide completes the animation
		        onSlideEnd      : null  	// Callback function: Once the slider reaches the last slide
			}*/
		};

		//	http://css-plus.com/2010/05/adding-user-options-to-your-jquery-plugin/
		//	http://api.jquery.com/jQuery.extend/
		var options = $.extend(true,{},defaults, options);

		// To avoid scope issues, use 'self' instead of 'this'
		// To reference this class from internal events and functions.
        var self = this;

        // Access to jQuery and DOM versions of element
       	var elementName = self.element;
        self.$element = $(element);
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

		// IF slide for row length > 1
		if (options.item.forRow >= 2){
			pane_count = pane_count-(options.item.forRow-1);
			//current_pane = options.item.forRow-1;
		}


		//initialization

		this.init=function() {

			self.setPaneDimensions();
			// IF slide length > 0
			if (pane_count > 1){
				// INIT NAVIGATION
				if (options.nav.state){
					self.navigation();
				}
				// INIT SLIDESHOW
				if (options.slideshow.state){
					self.sliderstartTimer();
				}
			}


			//CHECK TAB ACTION
			$(window).on("resize orientationchange", function() {
				clearInterval(slideTimer);
				self.setPaneDimensions();
				//updateOffset();
			});
			//IF open nav SGM
			$('.menu-trigger').on("click", function() {
				clearInterval(slideTimer);
			});

		};


		//set the pane dimensions and scale the container

		this.setPaneDimensions=function() {
			container.add('.carousel .nav, .carousel .indicators').addClass('invisible');
			element.addClass('loading');
			//var panesHeight = (panes.height())+'px';
		 	pane_width = (element.innerWidth())/options.item.forRow;
		 	panes.each(function() {
		 		$(this).width(pane_width);
		 	});
			var container_width = pane_width*(pane_count);
		 	if (options.item.forRow >= 2){
				container_width = pane_width*(pane_count+(options.item.forRow-1));
		 	}
	 		container.animate(
	 			{
	 				width:container_width
	 			}, 50, function() {
					// math complete.
					element.removeClass('loading');
					container.add('.carousel .nav, .carousel .indicators').delay(100).removeClass('invisible');
				}
			);
		};	// self.setPaneDimensions();


		this.navigation=function() {
		 	element.addClass('withnav');

		 	if(options.nav.arrow){

		 		var left = "<a class='nav prev hidden' rel='prev' href='javascript:void(0);'> <span class='icon-sgm-icon-arrowleft' aria-hidden='true'></span></a>";
		 		var right = "<a class='nav next' rel='next' href='javascript:void(0);'><span class='icon-sgm-icon-arrowright' aria-hidden='true'></span></a>";

		 		$(left).prependTo(element);
		 		$(right).appendTo(element);

				//CLICK ON ARROW
				element.on('click','.nav',function(e,simulated){
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
			if(options.nav.keyArrow){

				element.bind().keyup( function (e) {
					//console.log('eccoci');
                    if ( e.keyCode == 39 ) { // Right arrow
                    	self.next();
                   		return false;
                    } else if ( e.keyCode == 37 ) { // Left arrow
                    	self.prev();
                   		return false;
                    }; // e.keyCode
                }); // window.keyup
			}

			if(options.nav.spot){

				var indicators = "<ul class='indicators'>";

				//check how many steps we need
				for (var i=0;i<pane_count;i++) {
					$(this).data('ind','ind_'+i);
					indicators +=  '<li class="spot" data-index="'+i+'"><a href="javascript:void(0);"></a></li>';
				}


				indicators += "</ul>";
				$(indicators).appendTo(element);

				// center pointers in page:
				var leftMargin = $('.indicators').outerWidth() / 2 ;
				$('.indicators').css('margin-left',-leftMargin+'px');

				element.find('.indicators li:eq(0)').addClass('active');

				//CLICK ON INDICATORS SPOT
				element.on('click','.spot',function(e,simulated){
					if(!simulated){
						//console.log('click on spot SO: stop slideshow')
						clearInterval(slideTimer);	// A real click occured. Cancel the auto advance animation.
					}
					var item = $(this).data('index');
					//console.log('current_pane: '+current_pane+' index: '+item);
					self.goToIndex(item);
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
					//console.log('SLIDESHOW di: '+elementName+' n° slide: '+i_slide+' n° loop: '+i_loop+'/'+options.slideshow.stopLoop+' slideCounter: '+slideCounter+' pane_count: '+pane_count)
					if (slideCounter==pane_count) {
						self.goToIndex(0);
						if(options.slideshow.stopLoop==i_loop){
							//console.log('fine')
							clearInterval(slideTimer);
						} else {
							//console.log('ancora');
							slideCounter = 1;
						}
						i_loop++
					} else {
						//console.log('avanti')
						self.goToIndex(slideCounter);
						slideCounter++;
					}
					i_slide++ // loop number index
				}, 4000);
			}
		}; // self.sliderstartTimer();

		//show pane by index
		this.showPane=function(index) {
			// between the bounds
			index = Math.max(0, Math.min(index, pane_count-1));
			current_pane = index;
			var offset = -((100/pane_count)*current_pane);
			setContainerOffset(offset, true);
			element.find('.indicators li:eq('+(current_pane)+')').addClass('active');
		};	// self.showPane();


		function setContainerOffset(percent, animate) {
			container.removeClass("animate");

			if(animate) {
				container.addClass("animate");
			}
			if(Modernizr.csstransforms3d) {
				//container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
				var px = ((pane_width*pane_count) / 100) * percent;
				container.css("transform", 'translate3d('+px+'px,0,0) scale3d(1,1,1)');
			}
			else if(Modernizr.csstransforms) {
				//container.css("transform", "translate("+ percent +"%,0)");
				var px = ((pane_width*pane_count) / 100) * percent;
				container.css("transform", "translate("+px+"px,0)");
			}
			else {
				var px = ((pane_width*pane_count) / 100) * percent;
				container.css("left", px+"px");
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
			//console.log('prev '+current_pane);
			self.updatenav(current_pane,index);
			return this.showPane(index, true);
		};	// self.prev();

		this.updatenav=function(index,direction) {
			element.find('.nav').removeClass('hidden');
			element.find('.indicators li').removeClass('active');

			switch(direction) {
				case 'prev':
					//console.log('prev - current_pane: '+current_pane+' - pane_count: '+pane_count);
					if(current_pane<=1){
						element.find('.prev').addClass('hidden');
					}
					//element.find('.indicators li:eq('+(current_pane+1)+')').addClass('active');
					break;
					case 'next':
					//console.log('prev - next: '+current_pane+' - pane_count: '+pane_count);
					if(current_pane>=(pane_count-2)){
						element.find('.next').addClass('hidden');
					}

					break;
					default:
					//console.log('RIC current_pane: '+current_pane+' index: '+direction+' pane_count: '+pane_count);
					if(direction==0){
						element.find('.prev').addClass('hidden');
					} else if (direction==(pane_count-1)){
						element.find('.next').addClass('hidden');

					}
					break;
				}
		};	// self.updatenav();

		function handleHammer(ev,simulated) {
			//console.log(ev);



			if(!simulated){
				//console.log('action release dragleft dragright swipeleft swiperight SO: stop slideshow')
				clearInterval(slideTimer);	// A real click occured. Cancel the auto advance animation.
			}

					/* -------- DZ TEST
						$('h1.title:eq(0)').html(ev.type + ' - ' + parseInt(ev.gesture.angle) + ' - ' + parseInt(ev.gesture.deltaY) );
					 -------- /DZ TEST  */

			switch(ev.type) {
				case 'dragright':
				case 'dragleft':

					ev.gesture.preventDefault();
					// stick to the finger
					var pane_offset = -(100/pane_count)*current_pane;
					var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

					// slow down at the first and last pane
					if((current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
						(current_pane == pane_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
						drag_offset *= .4;
					}


					// VERSIONE ORIGINALE DANIELE
					 setContainerOffset(drag_offset + pane_offset);


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

			 // onInit callback
            //if ( self.options.callbacks.onInit && typeof( self.options.callbacks.onInit ) == 'function' ) self.options.callbacks.onInit( self );

		}
		// IF slide length > 0
		this.init();
		if (pane_count > 1){
			// no swype on windows mobile
			if(!isIE) {
				element.hammer().on("release dragleft dragright swipeleft swiperight", handleHammer);
			}
		};

	}; // $.swipeCarousel


	$.fn.swipeCarousel=function(options){

		return this.each(function(){
			(new $.swipeCarosel(this,options));
			// Our plugin so far if ( $.isFunction( settings.complete ) ){ settings.complete.call( this ); }
		}); // this.each

	}; // $.fn.swipeCarosel

    // This function breaks the chain, but returns
    // the wip.carousel if it has been attached to the object.
    $.fn.getcasio_carousel = function(){
        this.data("swipeCarousel");
    };


})(jQuery, document, window);
