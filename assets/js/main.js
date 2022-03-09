// ----------------------------------------------------------------------------------------------------
// Custom stuff.

// ----------------------------------------------------------------------------------------------------
// Returns a Promise that resolves after "ms" milliseconds.
function timer(ms) {
	return new Promise(res => setTimeout(res, ms))
}

// ----------------------------------------------------------------------------------------------------
async function gradualBlockCascade(wrapperElement, turnOn, message) {
	console.log(`Activated by ${message}`)
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
		await timer(150)
	}
}

// ----------------------------------------------------------------------------------------------------
// HTML5UP jQuery stuff.

// ----------------------------------------------------------------------------------------------------
(function($) {
	const $window = $(window),
		$body = $('body');

	// Breakpoints.
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ null,      '480px'  ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch mode.
	if (browser.mobile)
		$body.addClass('is-touch');

	// Scrolly links.
	$('.scrolly').scrolly({
		speed: 2300
	});

	// Dropdowns.
	$('#nav > ul').dropotron({
		alignment: 'right',
		hideDelay: 350
	});

	// Nav Title Bar.
	$(
		'<div id="titleBar">' +
			'<a href="#navPanel" class="toggle"></a>' +
			'<span class="title">' + $('#logo').html() + '</span>' +
		'</div>'
	).appendTo($body);

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
	});

	// Parallax.
	// Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
	if (browser.name === 'ie' || browser.mobile) {
		$.fn._parallax = function() {
			return $(this);
		};
	}
	else {
		$.fn._parallax = function() {
			$(this).each(function() {
				let $this = $(this), on, off;

				on = function() {
					$this.css('background-position', 'center 0px');

					$window.on('scroll._parallax', function() {
						const pos = parseInt($window.scrollTop()) - parseInt($this.position().top);
						$this.css('background-position', 'center ' + (pos * -0.2) + 'px');
					});
				};

				off = function() {
					$this.css('background-position', '');
					$window.off('scroll._parallax');
				};

				breakpoints.on('<=medium', off);
				breakpoints.on('>medium', on);

			});

			return $(this);

		};

		$window
			.on('load resize', function() {
				$window.trigger('scroll');
			});

	}

	// Spotlights.
	const $spotlights = $('.spotlight');

	$spotlights._parallax().each(function() {
		let $this = $(this), on, off;

		on = function() {
			let top, bottom, mode;
			// Use main <img>'s src as this spotlight's background.
			$this.css('background-image', `url("${$this.find('.image.main > img').attr('src')}")`);

			// Side-specific scrollex tweaks.
			if ($this.hasClass('top')) {
				mode = 'top';
				top = '-20%';
				bottom = 0;
			}
			else if ($this.hasClass('bottom')) {
				mode = 'bottom-only';
				top = 0;
				bottom = '20%';
			}
			else {
				mode = 'middle';
				top = 0;
				bottom = 0;
			}

			// Add scrollex.
			$this.scrollex({
				mode:		mode,
				top:		top,
				bottom:		bottom,
				initialize:	function() { $this.addClass('inactive'); },
				terminate:	function() { $this.removeClass('inactive'); },
				enter:		function() { $this.removeClass('inactive'); },

				// Uncomment the line below to "rewind" when this spotlight scrolls out of view.
				// leave:	function(t) { $this.addClass('inactive'); },

			});
		};

		off = function() {
			// Clear spotlight's background.
			$this.css('background-image', '');
			// Remove scrollex.
			$this.unscrollex();
		};

		breakpoints.on('<=medium', off);
		breakpoints.on('>medium', on);
	});

	// Wrappers.
	const $wrappers = $('.wrapper');

	$wrappers.each(function() {
		let $this = $(this), on, off;

		on = function() {
			$this.scrollex({
				top:		250,
				bottom:		0,
				initialize:	function() { gradualBlockCascade($this, true, 'initialize') },
				terminate:	function() { gradualBlockCascade($this, false, 'terminate') },
				enter: function() { gradualBlockCascade($this, true, 'enter') },
				leave: function() { gradualBlockCascade($this, false, 'leave') }
			});
		};

		off = function() {
			$this.unscrollex();
		};

		breakpoints.on('<=medium', off);
		breakpoints.on('>medium', on);
	});

	// Banner.
	const $banner = $('#banner');
	$banner._parallax();

})(jQuery);