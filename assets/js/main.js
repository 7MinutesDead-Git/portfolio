// ----------------------------------------------------------------------------------------------------
// Custom stuff.
const scrollySpeed = 2500
let reCAPTCHA

window.addEventListener("DOMContentLoaded", (e) => {
	setupContactFormStorage()
	setupButtonEvents()
})

// reCAPTCHA may not load in before everything else is loaded.
window.onload = () => {
	reCAPTCHA = document.querySelector('.recaptcha-wrapper')
}

const contactEmail = document.querySelector('#email')
const contactName = document.querySelector('#name')
const contactCategory = document.querySelector('#category')
const contactMessage = document.querySelector('#message')
const contactForm = [contactEmail, contactName, contactCategory, contactMessage]

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
async function skillsCascade(wrapperElement, turnOn) {
	// wrapperElement should be a jQuery object (until refactor).
	turnOn ? wrapperElement.removeClass('inactive') : wrapperElement.addClass('inactive')
	await timer(300)

	const sections = document.querySelectorAll('#four .gtr-uniform section')
	for (const child of sections) {
		turnOn ? child.classList.remove('inactive') : child.classList.add('inactive')
		await timer(scrollySpeed / 10)
	}
}

let firstLoad = true
async function spotlightCascade(spotlight, turnOn) {
	// Spotlight should be a jQuery object (until refactor).
	turnOn ? spotlight.removeClass('inactive') : spotlight.addClass('inactive')
	// Remove slow transitions on initial page load so we don't get weird
	// leftover animations if the person starts scrolling quickly.
	if (!firstLoad)
		await timer(200)
	// https://stackoverflow.com/a/306904/13627106
	// Since each section shares the same class "spotlight", we want to only select
	// the paragraphs within the spotlight we just scrolled into.
	// We can do that with jQuery since the original script below uses a jQuery object anyway.
	const paragraphs = spotlight.find("p")
	for (const p of paragraphs) {
		turnOn ? p.classList.remove('inactive') : p.classList.add('inactive')
		if (!firstLoad)
			await timer(scrollySpeed / 5)
	}
	firstLoad = false

}

function setupContactFormStorage() {
	// Check local storage for previous form data, and setup input listeners for storing new data.
	for (const contactInput of contactForm)  {
		if (localStorage.getItem(contactInput.id)) {
			contactInput.value = localStorage.getItem(contactInput.id)
		}
		contactInput.addEventListener('input', () => {
			localStorage.setItem(contactInput.id, contactInput.value)
		})
	}
}

function clearForm() {
	for (const contactInput of contactForm) {
		if (localStorage.getItem(contactInput.id)) {
			localStorage.setItem(contactInput.id, '')
			contactInput.value = ''
		}
	}
}

function setupButtonEvents() {
	const contactForm = document.querySelector('.contact-form')
	const closeContactConfirm = document.querySelector('.button-close-contact-success')

	contactForm.addEventListener('submit', (e) => {
		toggleFormSubmitConfirm()
		clearForm()
	})
	contactForm.addEventListener('invalid', (e) => {
		console.log('Invalid form submission: ', e)
	})

	closeContactConfirm.addEventListener('click', () => {
		toggleFormSubmitConfirm()
	})
}

function toggleFormSubmitConfirm() {
	const confirmationOverlay = document.querySelector('.contact-success')
	confirmationOverlay.classList.toggle('inactive')
	console.log('Confirm dialogue toggled.')
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
				initialize:	function() { spotlightCascade($(this), false) },
				terminate:	function() { spotlightCascade($(this), false) },
				enter: function() { spotlightCascade($(this), true) },
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

	//Scroll effects for the skills section.
	$wrappers.each(function() {
		$(this).scrollex({
			top:		'20vh',
			bottom:		'-40vh',
			initialize:	function() { skillsCascade($(this), false) },
			terminate:	function() { skillsCascade($(this), false) },
			enter: function() { skillsCascade($(this), true) },
			// Uncomment the line below to "rewind" when this spotlight scrolls out of view.
			// leave: function() { skillsCascade($(this), false) }
		})
	})

	// Banner.
	const $banner = $('#banner')
	$banner._parallax()

})(jQuery)