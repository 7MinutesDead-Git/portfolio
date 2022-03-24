// ----------------------------------------------------------------------------------------------------
// Custom stuff.
const scrollySpeed = 2500
let reCAPTCHA

window.onload = () => {
	reCAPTCHA = document.querySelector('.recaptcha-wrapper')
}

// ----------------------------------------------------------------------------------------------------
// Returns a Promise that resolves after "ms" milliseconds.
function timer(ms) {
	return new Promise(res => setTimeout(res, ms))
}

// ----------------------------------------------------------------------------------------------------
/*
Gradually reveals or hides skill sections within resume wrapper.
@param {HTMLElement} wrapperElement - The parent wrapper element for the skill section blocks.
@param {Boolean} turnOn - Whether to turn on or off.
*/
async function gradualBlockCascade(wrapperElement, turnOn) {
	if (turnOn) {
		// wrapperElement should be a jQuery object (until refactor).
		wrapperElement.removeClass('inactive')
	} else {
		wrapperElement.addClass('inactive')
	}

	await timer(300)

	const sections = document.querySelectorAll('.gtr-uniform section')
	for (const child of sections) {
		if (turnOn) {
			child.classList.remove('inactive')
		} else {
			child.classList.add('inactive')
		}
		await timer(scrollySpeed / 10)
	}
}

// ----------------------------------------------------------------------------------------------------
// HTML5UP jQuery stuff.

// ----------------------------------------------------------------------------------------------------
(function($) {
	const $window = $(window),
		$body = $('body')

	// Breakpoints.
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ null,      '480px'  ]
	})

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload')
		}, 100)
	})

	// Touch mode.
	if (browser.mobile)
		$body.addClass('is-touch')

	// Scrolly links.
	$('.scrolly').scrolly({
		speed: scrollySpeed
	})

	// Dropdowns.
	$('#nav > ul').dropotron({
		alignment: 'right',
		hideDelay: 350
	})

	// Nav Title Bar.
	$(
		'<div id="titleBar">' +
			'<a href="#navPanel" class="toggle"></a>' +
			'<span class="title">' + $('#logo').html() + '</span>' +
		'</div>'
	).appendTo($body)

	// Nav Panel.
	$(
		'<div id="navPanel">' +
			'<nav>' +
				$('#nav').navList() +
			'</nav>' +
		'</div>'
	).appendTo($body).panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'left',
			target: $body,
			visibleClass: 'navPanel-visible'
	})

	// Parallax.
	// Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
	if (browser.name === 'ie' || browser.mobile) {
		$.fn._parallax = function() {
			return $(this)
		}
	}
	else {
		// This is the parallax scrolling effect for the background of each section.
		$.fn._parallax = function() {
			$(this).each(function() {
				let $this = $(this), on, off

				on = function() {
					$this.css('background-position', 'center 0px')

					$window.on('scroll._parallax', function() {
						const pos = parseInt($window.scrollTop()) - parseInt($this.position().top)
						$this.css('background-position', `center ${pos * -0.3}px`)
					})
				}

				off = function() {
					$this.css('background-position', '')
					$window.off('scroll._parallax')
				}

				breakpoints.on('<=medium', off)
				breakpoints.on('>medium', on)

			})

			return $(this)

		}

		$window
			.on('load resize', function() {
				$window.trigger('scroll')
			})

	}

	// Spotlights.
	const $spotlights = $('.spotlight')

	$spotlights._parallax().each(function() {
		let $this = $(this), on, off

		on = function() {
			let top, bottom, mode
			// Use main <img>'s src as this spotlight's background.
			$this.css('background-image', `url("${$this.find('.image.main > img').attr('src')}")`)

			// Side-specific scrollex tweaks.
			if ($this.hasClass('top')) {
				mode = 'top'
				top = '-20%'
				bottom = 0
			}
			else if ($this.hasClass('bottom')) {
				mode = 'bottom-only'
				top = 0
				bottom = '20%'
			}
			else {
				mode = 'middle'
				top = 0
				bottom = 0
			}

			// Add scrollex.
			$this.scrollex({
				mode:		mode,
				top:		top,
				bottom:		bottom,
				initialize:	function() { $this.addClass('inactive') },
				terminate:	function() { $this.removeClass('inactive') },
				enter:		function() { $this.removeClass('inactive') },

				// Uncomment the line below to "rewind" when this spotlight scrolls out of view.
				// leave:	function(t) { $this.addClass('inactive') },

			})
		}

		off = function() {
			// Clear spotlight's background.
			$this.css('background-image', '')
			// Remove scrollex.
			$this.unscrollex()
		}

		breakpoints.on('<=medium', off)
		breakpoints.on('>medium', on)
	})

	// Wrappers.
	const $wrappers = $('.wrapper')

	$wrappers.each(function() {
		$(this).scrollex({
			top:		'-40vh',
			bottom:		'-40vh',
			initialize:	function() { gradualBlockCascade($(this), true) },
			terminate:	function() { gradualBlockCascade($(this), false) },
			enter: function() { gradualBlockCascade($(this), true) },
			leave: function() { gradualBlockCascade($(this), false) }
		})
	})

	// Banner.
	const $banner = $('#banner')
	$banner._parallax()

})(jQuery)