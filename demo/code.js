// UTILS

function select (selector) {
	return document.querySelector(selector);
}

function bind (selector, event, callback) {
	select(selector).addEventListener(event, callback);
}

// EXAMPLE 1 - SIMPLE

var example1 = new ViewMatrix('.example-1');

bind('.example-1-prev', 'click', function () { example1.inc(-1); });
bind('.example-1-next', 'click', function () { example1.inc(+1); });

// EXAMPLE 2 - INFINITE

var example2 = new ViewMatrix('.example-2', {
	infinite: true
});

bind('.example-2-prev', 'click', function () { example2.inc(-1); });
bind('.example-2-next', 'click', function () { example2.inc(+1); });

/*

// EXAMPLE 3 - AUTOPLAY

var example3 = new ViewMatrix('.example-3');

example3.on('autoplay:start', function () {
	select('.example-3-play').disabled = true;
	select('.example-3-pause').disabled = false;
});
example3.on('autoplay:pause', function () {
	select('.example-3-play').disabled = false;
	select('.example-3-pause').disabled = true;
});

var example3autoplay = new ViewMatrix.Autoplay(example3, {
	direction: +1,
	interval: 3
});

bind('.example-3-prev', 'click', function () { example3.inc(-1); });
bind('.example-3-next', 'click', function () { example3.inc(+1); });
bind('.example-3-play', 'click', function () { example3autoplay.play(); });
bind('.example-3-pause', 'click', function () { example3autoplay.pause(); });

// EXAMPLE 4 - SWIPE

var example4 = new ViewMatrix('.example-4', {
	infinite: true,
});
var example4touch = new ViewMatrix.Touch(example4, {
	preventDefault: true,
	swipe: true,
	swipeVertical: true
});

bind('.example-4-prev', 'click', function () { example4.inc(-1); });
bind('.example-4-next', 'click', function () { example4.inc(+1); });

// test battery, uncomment to see how it reacts
// setTimeout(function () { example1.inc(+1); }, 500);
// setTimeout(function () { example1.inc(-1); }, 1000);
// setTimeout(function () { example1.slide(0); }, 1500);
// setTimeout(function () { example1.slide(3); }, 2000);
// setTimeout(function () { example1.slide(0); }, 2500);

*/
