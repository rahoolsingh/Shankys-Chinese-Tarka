"use strict";
(function () {
	// Global variables
	var
		userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$document = $(document),
		$window = $(window),
		$html = $("html"),
		$body = $("body"),

		isDesktop = $html.hasClass("desktop"),
		isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		windowReady = false,
		isNoviBuilder = false,
		livedemo = true,

		plugins = {
			customToggle:            $( '[data-custom-toggle]' ),
			captcha:                 $( '.recaptcha' ),
			copyrightYear:           $( '.copyright-year' ),
			owl:                     $( '.owl-carousel' ),
			preloader:               $( '.preloader' ),
			rdNavbar:                $( '.rd-navbar' ),
			rdMailForm:              $( '.rd-mailform' ),
			rdInputLabel:            $( '.form-label' ),
			regula:                  $( '[data-constraints]' ),
			swiper:                  $( '.swiper-container' ),
			wow:                     $( '.wow' ),
			selectFilter:            $( 'select' )
		};

	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target: document.querySelector( '.page' ),
				delay: 0,
				duration: 500,
				classIn: 'fadeIn',
				classOut: 'fadeOut',
				classActive: 'animated',
				conditions: function (event, link) {
					return link && !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onTransitionStart: function ( options ) {
					setTimeout( function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75 );
				},
				onReady: function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		/**
		 * @desc Animate captions on active slides
		 * @param {object} swiper - swiper instance
		 */
		function initCaptionAnimate( swiper ) {
			var
					animate = function ( caption ) {
						return function() {
							var duration;
							if ( duration = caption.getAttribute( 'data-caption-duration' ) ) caption.style.animationDuration = duration +'ms';
							caption.classList.remove( 'not-animated' );
							caption.classList.add( caption.getAttribute( 'data-caption-animate' ) );
							caption.classList.add( 'animated' );
						};
					},
					initializeAnimation = function ( captions ) {
						for ( var i = 0; i < captions.length; i++ ) {
							var caption = captions[i];
							caption.classList.remove( 'animated' );
							caption.classList.remove( caption.getAttribute( 'data-caption-animate' ) );
							caption.classList.add( 'not-animated' );
						}
					},
					finalizeAnimation = function ( captions ) {
						for ( var i = 0; i < captions.length; i++ ) {
							var caption = captions[i];
							if ( caption.getAttribute( 'data-caption-delay' ) ) {
								setTimeout( animate( caption ), Number( caption.getAttribute( 'data-caption-delay' ) ) );
							} else {
								animate( caption )();
							}
						}
					};

			// Caption parameters
			swiper.params.caption = {
				animationEvent: 'slideChangeTransitionEnd'
			};

			initializeAnimation( swiper.$wrapperEl[0].querySelectorAll( '[data-caption-animate]' ) );
			finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );

			if ( swiper.params.caption.animationEvent === 'slideChangeTransitionEnd' ) {
				swiper.on( swiper.params.caption.animationEvent, function() {
					initializeAnimation( swiper.$wrapperEl[0].children[ swiper.previousIndex ].querySelectorAll( '[data-caption-animate]' ) );
					finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );
				});
			} else {
				swiper.on( 'slideChangeTransitionEnd', function() {
					initializeAnimation( swiper.$wrapperEl[0].children[ swiper.previousIndex ].querySelectorAll( '[data-caption-animate]' ) );
				});

				swiper.on( swiper.params.caption.animationEvent, function() {
					finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );
				});
			}
		}

		/**
		 * @desc Plays required animation preset
		 * @param {object} el - animating DOM node
		 * @param {object} params - extra options
		 * @param {string} params.animation - anime preset name
		 * @param {string} [params.direction] - animation direction
		 * @param {string|array} [params.easing] - animation easing
		 * @param {number} [params.duration] - animation duration
		 */
		function bindAnimePreset( el, params ) {
			params = params || {};

			var preset = {
				'swiperContentRide': function () {
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							translateY: direction ? 0 : [ 100, 0 ],
							translateX: direction
									? direction === 'next'
											? [ 300, 0 ]
											: [ -300, 0 ]
									: 0,
							opacity: [ 0, 1 ]
						});
					};
					el.animeOut = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay*.3,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							translateX: direction
									? direction === 'next'
											? [ 0, -300 ]
											: [ 0, 300 ]
									: 0,
							opacity: [ 1, 0 ]
						});
					};
				},
				'swiperContentStack': function () {
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay || 0,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							translateY: [ 300, 0 ],
							rotate: [ direction === 'prev' ? 25 : -25, 0 ],
							opacity: [ 0, 1 ]
						});
					};
					el.animeOut = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay*.6 || 0,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							translateY: [ 0, -300 ],
							rotate: [ 0, direction === 'prev' ? -15 : 15 ],
							opacity: [ 1, 0 ]
						});
					};
				},
				'swiperContentDiagonal': function () {
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay || 0,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							translateY: [ 300, 0 ],
							translateX: [ direction === 'next' ? 300 : -300, 0 ],
							opacity: [ 0, 1 ]
						});
					};
					el.animeOut = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay*.6 || 0,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							opacity: [ 1, 0 ]
						});
					};
				},
				'swiperContentFade': function () {
					params.easing = params.easing || 'easeOutQuint';
					el.animeReset = function () {
						this.style.transform = 'none';
						this.style.opacity = 0;
					};
					el.animeStart = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							translateY: direction === 'next'
									? [ 100, 0 ]
									: [ -100, 0 ],
							opacity: [ 0, 1 ]
						});
					};
					el.animeOut = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay*.6 || 0,
							easing: params.easing || 'easeOutQuint',
							direction: params.direction,
							translateY: direction === 'next'
									? [ 0, -100 ]
									: [ 0, 100 ],
							opacity: [ 1, 0 ]
						});
					};
				},
				'swiperSlideRide': function () {
					el.animeReset = function () {
						this.style.transform = 'translateX(0) scale(1.2)';
					};
					el.animeStart = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay || 0,
							easing: params.easing || 'easeInOutQuad',
							direction: params.direction,
							translateX: direction
									? direction === 'next'
											? [ 200, 0 ]
											: [ -200, 0 ]
									: 0,
							scale: { value: 1.2, duration: 0, delay: 0 }
						});
					};
				},
				'swiperSlideRotate': function () {
					el.animeReset = function () {
						this.style.transform = 'rotate(0) scale(1.2)';
					};
					el.animeStart = function ( direction ) {
						el.style.transformOrigin = direction === 'next' ? '0% 50%' : '100% 50%';
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay || 0,
							easing: params.easing || 'easeOutElastic',
							direction: params.direction,
							elasticity: 350,
							rotate: direction
									? direction === 'next'
											? [ 5, 0 ]
											: [ -5, 0 ]
									: 0,
							scale: direction ? [ 1.3, 1.1 ] : 1
						});
					};
				},
				'swiperSlideZoomOut': function () {
					el.animeReset = function () {
						this.style.transform = 'none';
					};
					el.animeStart = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay || 0,
							easing: params.easing || 'easeInOutQuad',
							direction: params.direction,
							translateY: direction ? [ 300, 0 ] : 0,
							translateX: direction
									? direction === 'next'
											? [ 300, 0 ]
											: [ -300, 0 ]
									: 0,
							scale: direction ? [ 1.7, 1 ] : 1,
						});
					};
				},
				'swiperSlideZoomIn': function () {
					el.animeReset = function () {
						this.style.transform = 'none';
					};
					el.animeStart = function ( direction ) {
						anime({
							targets: el,
							duration: params.duration || 600,
							delay: params.delay || 0,
							easing: params.easing || 'easeInQuad',
							direction: params.direction,
							scale: direction ? [ .7, 1.7 ] : { value: 1.7, duration: 0 },
						});
					};
				}
			};

			if ( !preset[ params.animation ] ) console.warn( 'Unknown anime on:', el,'This will cause further errors.' );
			else preset[ params.animation ]();
		}

		/**
		 * @desc Anime.js animations for swiper events
		 * @param {object} swiper - swiper instance
		 */
		function initSwiperAnime( swiper ) {
			// Anime parameters
			swiper.params.anime = {
				animationEvent: 'TransitionStart' // TransitionStart|TransitionEnd
			};

			// Variable "wrappers" required for separated captions
			var wrappers = swiper.$el[0].querySelectorAll( '.swiper-wrapper' );

			for ( var w = 0; w < wrappers.length; w++ ) {
				var wrapper = wrappers[w];

				// Initialize Anime
				var nodeList = wrapper.querySelectorAll( '[data-swiper-anime]' );
				for ( var i = 0; i < nodeList.length; i++ ) {
					var el = nodeList[i];
					bindAnimePreset( el, JSON.parse( el.getAttribute( 'data-swiper-anime' ) ) );
				}

				// First play active slide
				nodeList = wrapper.children[ swiper.activeIndex ].querySelectorAll( '[data-swiper-anime]' );
				for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeStart ) nodeList[i].animeStart();

				swiper.on( 'slideNext'+swiper.params.anime.animationEvent, function( wrapper ) {
					return function () {
						var nodeList = wrapper.children[ swiper.activeIndex ].querySelectorAll( '[data-swiper-anime]' );
						for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeStart ) nodeList[i].animeStart( 'next' );
					};
				}( wrapper ));

				swiper.on( 'slidePrev'+swiper.params.anime.animationEvent, function( wrapper ) {
					return function () {
						var nodeList = wrapper.children[ swiper.activeIndex ].querySelectorAll( '[data-swiper-anime]' );
						for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeStart ) nodeList[i].animeStart( 'prev' );
					};
				}( wrapper ));

				swiper.on( 'slideNextTransitionStart', function( wrapper ) {
					return function () {
						var nodeList;
						if ( typeof( swiper.realPrevious ) === 'number' && swiper.previousIndex !== swiper.realPrevious ) {
							nodeList = wrapper.children[ swiper.realPrevious ].querySelectorAll( '[data-swiper-anime]' );
							for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeOut ) nodeList[i].animeOut( 'next' );
						}
						nodeList = wrapper.children[ swiper.previousIndex ].querySelectorAll( '[data-swiper-anime]' );
						for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeOut ) nodeList[i].animeOut( 'next' );
					};
				}( wrapper ));

				swiper.on( 'slidePrevTransitionStart', function( wrapper ) {
					return function () {
						var nodeList;
						if ( typeof( swiper.realPrevious ) === 'number' && swiper.previousIndex !== swiper.realPrevious ) {
							nodeList = wrapper.children[ swiper.realPrevious ].querySelectorAll( '[data-swiper-anime]' );
							for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeOut ) nodeList[i].animeOut( 'prev' );
						}
						nodeList = wrapper.children[ swiper.previousIndex ].querySelectorAll( '[data-swiper-anime]' );
						for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeOut ) nodeList[i].animeOut( 'prev' );
					};
				}( wrapper ));

				if ( swiper.params.anime.animationEvent === 'TransitionEnd' ) {
					swiper.on( 'slideChangeTransitionStart', function( wrapper ) {
						return function () {
							var nodeList = wrapper.children[ swiper.activeIndex ].querySelectorAll( '[data-swiper-anime]' );
							for ( var i = 0; i < nodeList.length; i++ ) if ( nodeList[i].animeReset ) nodeList[i].animeReset();
						};
					}( wrapper ));
				}
			}
		}

		/**
		 * @desc Init custom background circle effect
		 * @param {object} swiper - swiper instance
		 */
		function initCircleBg( swiper ) {
			/**
			 * @desc Recalculate decorative circle parameters
			 * @param {object} swiper - swiper instance
			 * @return {object} - circle parameters
			 */
			function calcCircle( swiper ) {
				var activeSlide = swiper.$wrapperEl[0].children[swiper.activeIndex];
				return {
					centerX: activeSlide.getAttribute( 'data-circle-cx' ) ? swiper.width*activeSlide.getAttribute( 'data-circle-cx' ) : swiper.width/2,
					centerY: activeSlide.getAttribute( 'data-circle-cy' ) ? swiper.height*activeSlide.getAttribute( 'data-circle-cy' ) : swiper.height/2,
					radius: activeSlide.getAttribute( 'data-circle-r' ) ? swiper.width*activeSlide.getAttribute( 'data-circle-r' ) : swiper.height*.4
				};
			}

			// Decoretive circle parameters
			swiper.params.decor = {
				easingIn: 'easeOutQuad',
				easingOut: 'easeOutQuad'
			};

			swiper.decor = {};
			swiper.decor.el = document.createElement( 'div' );
			swiper.decor.el.classList.add( 'swiper-decorative' );
			swiper.decor.circle = calcCircle( swiper );
			swiper.decor.el.innerHTML = '<div class="swiper-decorative-circle" style="left:'+swiper.decor.circle.centerX+'px;top:'+swiper.decor.circle.centerY+'px;width:'+(swiper.decor.circle.radius*2)+'px;height:'+(swiper.decor.circle.radius*2)+'px"></div>';
			swiper.$el[0].insertBefore( swiper.decor.el, swiper.$wrapperEl[0] );
			swiper.decor.circleEl = swiper.decor.el.querySelector('.swiper-decorative-circle');

			swiper.on( 'resize', function () {
				swiper.decor.circle = calcCircle( swiper );
				swiper.decor.circleEl.setAttribute( 'style', 'left:'+swiper.decor.circle.centerX+'px;top:'+swiper.decor.circle.centerY+'px;width:'+(swiper.decor.circle.radius*2)+'px;height:'+(swiper.decor.circle.radius*2)+'px' );
			});

			swiper.on( 'slideChangeTransitionStart', function () {
				var swiper = this;
				swiper.decor.circle = calcCircle( swiper );

				var shapeIn = function () {
					return new Promise( function( resolve, reject ) {
						anime({
							targets: swiper.decor.circleEl,
							duration: swiper.params.speed / 4,
							easing: swiper.params.decor.easingIn,
							left: swiper.width/2,
							top: swiper.height/2,
							width: swiper.width * 2,
							height: swiper.width * 2,
							complete: resolve
						})
					});
				};

				var shapeOut = function () {
					return new Promise( function( resolve, reject ) {
						anime({
							targets: swiper.decor.circleEl,
							duration: swiper.params.speed/4,
							delay: swiper.params.speed/2,
							easing: swiper.params.decor.easingOut,
							left: swiper.decor.circle.centerX,
							top: swiper.decor.circle.centerY,
							width: swiper.decor.circle.radius * 2,
							height: swiper.decor.circle.radius * 2,
							complete: resolve
						});
					});
				};

				shapeIn().then( shapeOut );
			});
		}

		/**
		 * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
		 * @param {object} swiper - swiper instance
		 */
		function setRealPrevious( swiper ) {
			var element = swiper.$wrapperEl[0].children[ swiper.activeIndex ];
			swiper.realPrevious = Array.prototype.indexOf.call( element.parentNode.children, element );
		}

		/**
		 * @desc Initialize owl carousel plugin
		 * @param {object} carousel - carousel jQuery object
		 */
		function initOwlCarousel ( carousel ) {
			var
				aliaces = [ '-', '-sm-', '-md-', '-lg-', '-xl-', '-xxl-' ],
				values = [ 0, 576, 768, 992, 1200, 1600 ],
				responsive = {};

			for ( var j = 0; j < values.length; j++ ) {
				responsive[ values[ j ] ] = {};
				for ( var k = j; k >= -1; k-- ) {
					if ( !responsive[ values[ j ] ][ 'items' ] && carousel.attr( 'data' + aliaces[ k ] + 'items' ) ) {
						responsive[ values[ j ] ][ 'items' ] = k < 0 ? 1 : parseInt( carousel.attr( 'data' + aliaces[ k ] + 'items' ), 10 );
					}
					if ( !responsive[ values[ j ] ][ 'stagePadding' ] && responsive[ values[ j ] ][ 'stagePadding' ] !== 0 && carousel.attr( 'data' + aliaces[ k ] + 'stage-padding' ) ) {
						responsive[ values[ j ] ][ 'stagePadding' ] = k < 0 ? 0 : parseInt( carousel.attr( 'data' + aliaces[ k ] + 'stage-padding' ), 10 );
					}
					if ( !responsive[ values[ j ] ][ 'margin' ] && responsive[ values[ j ] ][ 'margin' ] !== 0 && carousel.attr( 'data' + aliaces[ k ] + 'margin' ) ) {
						responsive[ values[ j ] ][ 'margin' ] = k < 0 ? 30 : parseInt( carousel.attr( 'data' + aliaces[ k ] + 'margin' ), 10 );
					}
				}
			}

			// Enable custom pagination
			if ( carousel.attr( 'data-dots-custom' ) ) {
				carousel.on( 'initialized.owl.carousel', function ( event ) {
					var
						carousel = $( event.currentTarget ),
						customPag = $( carousel.attr( 'data-dots-custom' ) ),
						active = 0;

					if ( carousel.attr( 'data-active' ) ) {
						active = parseInt( carousel.attr( 'data-active' ), 10 );
					}

					carousel.trigger( 'to.owl.carousel', [ active, 300, true ] );
					customPag.find( '[data-owl-item="' + active + '"]' ).addClass( 'active' );

					customPag.find( '[data-owl-item]' ).on( 'click', function ( event ) {
						event.preventDefault();
						carousel.trigger( 'to.owl.carousel', [ parseInt( this.getAttribute( 'data-owl-item' ), 10 ), 300, true ] );
					} );

					carousel.on( 'translate.owl.carousel', function ( event ) {
						customPag.find( '.active' ).removeClass( 'active' );
						customPag.find( '[data-owl-item="' + event.item.index + '"]' ).addClass( 'active' )
					} );
				} );
			}

			carousel.owlCarousel( {
				autoplay:           isNoviBuilder ? false : carousel.attr( 'data-autoplay' ) !== 'false',
				autoplayTimeout:    carousel.attr( "data-autoplay" ) ? Number( carousel.attr( "data-autoplay" ) ) : 3000,
				autoplayHoverPause: true,
				loop:               isNoviBuilder ? false : carousel.attr( 'data-loop' ) !== 'false',
				items:              1,
				center:             carousel.attr( 'data-center' ) === 'true',
				dotsContainer:      carousel.attr( 'data-pagination-class' ) || false,
				navContainer:       carousel.attr( 'data-navigation-class' ) || false,
				mouseDrag:          isNoviBuilder ? false : carousel.attr( 'data-mouse-drag' ) !== 'false',
				nav:                carousel.attr( 'data-nav' ) === 'true',
				dots:               carousel.attr( 'data-dots' ) === 'true',
				dotsEach:           carousel.attr( 'data-dots-each' ) ? parseInt( carousel.attr( 'data-dots-each' ), 10 ) : false,
				animateIn:          carousel.attr( 'data-animation-in' ) ? carousel.attr( 'data-animation-in' ) : false,
				animateOut:         carousel.attr( 'data-animation-out' ) ? carousel.attr( 'data-animation-out' ) : false,
				responsive:         responsive,
				navText:            carousel.attr( 'data-nav-text' ) ? $.parseJSON( carousel.attr( 'data-nav-text' ) ) : [],
				navClass:           carousel.attr( 'data-nav-class' ) ? $.parseJSON( carousel.attr( 'data-nav-class' ) ) : [ 'owl-prev', 'owl-next' ]
			} );
		}

		/**
		 * @desc Attach form validation to elements
		 * @param {object} elements - jQuery object
		 */
		function attachFormValidator(elements) {
			// Custom validator - phone number
			regula.custom({
				name: 'PhoneNumber',
				defaultMessage: 'Invalid phone number format',
				validator: function() {
					if ( this.value === '' ) return true;
					else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test( this.value );
				}
			});

			for (var i = 0; i < elements.length; i++) {
				var o = $(elements[i]), v;
				o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
				v = o.parent().find(".form-validation");
				if (v.is(":last-child")) o.addClass("form-control-last-child");
			}

			elements.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
				if ($this.parents('.rd-mailform').hasClass('success')) return;

				if (( results = $this.regula('validate') ).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}).regula('bind');

			var regularConstraintsMessages = [
				{
					type: regula.Constraint.Required,
					newMessage: "The text field is required."
				},
				{
					type: regula.Constraint.Email,
					newMessage: "The email is not a valid email."
				},
				{
					type: regula.Constraint.Numeric,
					newMessage: "Only numbers are required"
				},
				{
					type: regula.Constraint.Selected,
					newMessage: "Please choose an option."
				}
			];


			for (var i = 0; i < regularConstraintsMessages.length; i++) {
				var regularConstraint = regularConstraintsMessages[i];

				regula.override({
					constraintType: regularConstraint.type,
					defaultMessage: regularConstraint.newMessage
				});
			}
		}

		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}

		/**
		 * @desc Validate google reCaptcha
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function validateReCaptcha(captcha) {
			var captchaToken = captcha.find('.g-recaptcha-response').val();

			if (captchaToken.length === 0) {
				captcha
					.siblings('.form-validation')
					.html('Please, prove that you are not robot.')
					.addClass('active');
				captcha
					.closest('.form-wrap')
					.addClass('has-error');

				captcha.on('propertychange', function () {
					var $this = $(this),
						captchaToken = $this.find('.g-recaptcha-response').val();

					if (captchaToken.length > 0) {
						$this
							.closest('.form-wrap')
							.removeClass('has-error');
						$this
							.siblings('.form-validation')
							.removeClass('active')
							.html('');
						$this.off('propertychange');
					}
				});

				return false;
			}

			return true;
		}

		/**
		 * @desc Initialize Google reCaptcha
		 */
		window.onloadCaptchaCallback = function () {
			for (var i = 0; i < plugins.captcha.length; i++) {
				var $capthcaItem = $(plugins.captcha[i]);

				grecaptcha.render(
					$capthcaItem.attr('id'),
					{
						sitekey: $capthcaItem.attr('data-sitekey'),
						size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
						theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
						callback: function (e) {
							$('.recaptcha').trigger('propertychange');
						}
					}
				);
				$capthcaItem.after("<span class='form-validation'></span>");
			}
		};

		// Google ReCaptcha
		if (plugins.captcha.length) {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		}

		// Additional class on html if mac os.
		if (navigator.platform.match(/(Mac)/i)) {
			$html.addClass("mac-os");
		}

		// Adds some loosing functionality to IE browsers (IE Polyfills)
		if (isIE) {
			if (isIE === 12) $html.addClass("ie-edge");
			if (isIE === 11) $html.addClass("ie-11");
			if (isIE < 10) $html.addClass("lt-ie-10");
			if (isIE < 11) $html.addClass("ie-10");
		}

		// Copyright Year (Evaluates correct copyright year)
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// UI To Top
		if (isDesktop && !isNoviBuilder) {
			$().UItoTop({
				easingType: 'easeOutQuad',
				containerClass: 'ui-to-top fa fa-angle-up'
			});
		}

		// RD Navbar
		if (plugins.rdNavbar.length) {
			var aliaces, i, j, len, value, values, responsiveNavbar;

			aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
			values = [0, 576, 768, 992, 1200, 1600];
			responsiveNavbar = {};

			for (i = j = 0, len = values.length; j < len; i = ++j) {
				value = values[i];
				if (!responsiveNavbar[values[i]]) {
					responsiveNavbar[values[i]] = {};
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
					responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
					responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
					responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
					responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
				}

				if (isNoviBuilder) {
					responsiveNavbar[values[i]]['stickUp'] = false;
				} else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
					responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
				}

				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
					responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
				}
			}


			plugins.rdNavbar.RDNavbar({
				anchorNav: !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive: responsiveNavbar,
				callbacks: {
					onStuck: function () {
						var navbarSearch = this.$element.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck: function () {
						if (this.$clone === null)
							return;

						var navbarSearch = this.$clone.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
							navbarSearch.trigger('blur');
						}

					}
				}
			});


			if (plugins.rdNavbar.attr("data-body-class")) {
				document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
			}
		}

		// Swiper
		if ( plugins.swiper ) {
			for ( var i = 0; i < plugins.swiper.length; i++ ) {
				var
					sliderMarkup = plugins.swiper[i],
					swiper,
					options = {
						loop: sliderMarkup.getAttribute( 'data-loop' ) === 'true' || false,
						effect: sliderMarkup.getAttribute( 'data-effect' ) || 'fade',
						direction: sliderMarkup.getAttribute( 'data-direction' ) || 'horizontal',
						speed: sliderMarkup.getAttribute( 'data-speed' ) ? Number( sliderMarkup.getAttribute( 'data-speed' ) ) : 1000,
						allowTouchMove: false,
						preventIntercationOnTransition: true,
						runCallbacksOnInit: false,
						separateCaptions: sliderMarkup.getAttribute( 'data-separate-captions' ) === 'true' || false
					};

				if ( sliderMarkup.getAttribute( 'data-autoplay' ) ) {
					options.autoplay = {
						delay: Number( sliderMarkup.getAttribute( 'data-autoplay' ) ) || 3000,
						stopOnLastSlide: false,
						disableOnInteraction: true,
						reverseDirection: false,
					};
				}

				if ( sliderMarkup.getAttribute( 'data-keyboard' ) === 'true' ) {
					options.keyboard = {
						enabled: sliderMarkup.getAttribute( 'data-keyboard' ) === 'true',
						onlyInViewport: true
					};
				}

				if ( sliderMarkup.getAttribute( 'data-mousewheel' ) === 'true' ) {
					options.mousewheel = {
						releaseOnEdges: true,
						sensitivity: .1
					};
				}

				if ( sliderMarkup.querySelector( '.swiper-button-next, .swiper-button-prev' ) ) {
					options.navigation = {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					};
				}

				if ( sliderMarkup.querySelector( '.swiper-pagination' ) ) {
					options.pagination = {
						el: '.swiper-pagination',
						type: 'bullets',
						clickable: true
					};
				}

				if ( sliderMarkup.querySelector( '.swiper-scrollbar' ) ) {
					options.scrollbar = {
						el: '.swiper-scrollbar',
						hide: true,
						draggable: true
					};
				}

				options.on = {
					init: function () {
						setRealPrevious( this );
						switch( options.effect ) {
							case 'circle-bg':
								initCircleBg( this );
								break;
						}
						initSwiperAnime( this );
						initCaptionAnimate( this );

						// Real Previous Index must be set recent
						this.on( 'slideChangeTransitionEnd', function () {
							setRealPrevious( this );
						});
					}
				};

				swiper = new Swiper ( plugins.swiper[i], options );
			}
		}

		// Owl carousel
		if ( plugins.owl.length ) {
			for ( var i = 0; i < plugins.owl.length; i++ ) {
				var carousel = $( plugins.owl[ i ] );
				plugins.owl[ i ].owl = carousel;
				initOwlCarousel( carousel );
			}
		}

		// WOW
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			new WOW().init();
		}

		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// Regula
		if (plugins.regula.length) {
			attachFormValidator(plugins.regula);
		}

		// RD Mailform
		if (plugins.rdMailForm.length) {
			var i, j, k,
				msg = {
					'MF000': 'Successfully sent!',
					'MF001': 'Recipients are not set!',
					'MF002': 'Form will not work locally!',
					'MF003': 'Please, define email field in your form!',
					'MF004': 'Please, define type of your form!',
					'MF254': 'Something went wrong with PHPMailer!',
					'MF255': 'Aw, snap! Something went wrong.'
				};

			for (i = 0; i < plugins.rdMailForm.length; i++) {
				var $form = $(plugins.rdMailForm[i]),
					formHasCaptcha = false;

				$form.attr('novalidate', 'novalidate').ajaxForm({
					data: {
						"form-type": $form.attr("data-form-type") || "contact",
						"counter": i
					},
					beforeSubmit: function (arr, $form, options) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
							inputs = form.find("[data-constraints]"),
							output = $("#" + form.attr("data-form-output")),
							captcha = form.find('.recaptcha'),
							captchaFlag = true;

						output.removeClass("active error success");

						if (isValidated(inputs, captcha)) {

							// veify reCaptcha
							if (captcha.length) {
								var captchaToken = captcha.find('.g-recaptcha-response').val(),
									captchaMsg = {
										'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
										'CPT002': 'Something wrong with google reCaptcha'
									};

								formHasCaptcha = true;

								$.ajax({
									method: "POST",
									url: "bat/reCaptcha.php",
									data: {'g-recaptcha-response': captchaToken},
									async: false
								})
									.done(function (responceCode) {
										if (responceCode !== 'CPT000') {
											if (output.hasClass("snackbars")) {
												output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

												setTimeout(function () {
													output.removeClass("active");
												}, 3500);

												captchaFlag = false;
											} else {
												output.html(captchaMsg[responceCode]);
											}

											output.addClass("active");
										}
									});
							}

							if (!captchaFlag) {
								return false;
							}

							form.addClass('form-in-process');

							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
								output.addClass("active");
							}
						} else {
							return false;
						}
					},
					error: function (result) {
						if (isNoviBuilder)
							return;

						var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
							form = $(plugins.rdMailForm[this.extraData.counter]);

						output.text(msg[result]);
						form.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}
					},
					success: function (result) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
							output = $("#" + form.attr("data-form-output")),
							select = form.find('select');

						form
							.addClass('success')
							.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}

						result = result.length === 5 ? result : 'MF255';
						output.text(msg[result]);

						if (result === "MF000") {
							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active success");
							}
						} else {
							if (output.hasClass("snackbars")) {
								output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active error");
							}
						}

						form.clearForm();

						if (select.length) {
							select.select2("val", "");
						}

						form.find('input, textarea').trigger('blur');

						setTimeout(function () {
							output.removeClass("active error success");
							form.removeClass('success');
						}, 3500);
					}
				});
			}
		}

		// Custom Toggles
		if (plugins.customToggle.length) {
			for (var i = 0; i < plugins.customToggle.length; i++) {
				var $this = $(plugins.customToggle[i]);

				$this.on('click', $.proxy(function (event) {
					event.preventDefault();

					var $ctx = $(this);
					$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
				}, $this));

				if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0]
							&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
							&& e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}

				if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}
			}
		}

		// Select 2
		if ( plugins.selectFilter.length ) {
			for ( var i = 0; i < plugins.selectFilter.length; i++ ) {
				var select = $( plugins.selectFilter[ i ] );

				select.select2( {
					dropdownParent:          $( '.page' ),
					placeholder:             select.attr( 'data-placeholder' ) || null,
					minimumResultsForSearch: select.attr( 'data-minimum-results-search' ) || Infinity,
					containerCssClass:       select.attr( 'data-container-class' ) || null,
					dropdownCssClass:        select.attr( 'data-dropdown-class' ) || null
				} );
			}
		}

	});
}());
