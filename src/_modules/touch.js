var Utils = require('./utils');

/**
 * Checks if the given "coords" are contained within a "target".
 *
 * @param {Element} target - The target to check.
 * @param {Point} coords - The coordinates to check if they're inside the Target.
 */
function inTargetBounds (target, coords) {
	return target &&
		coords.x >= target.offsetLeft && coords.x <= target.offsetLeft + target.offsetWidth &&
		coords.y >= target.offsetTop && coords.y <= target.offsetTop + target.offsetHeight;
};

/**
 * Returns a Point object from an event's coordinates.
 * If the event has any touches, it returns the first touch's coordinates.
 *
 * @param {Event} evt - The event to extract the coordinates from.
 * @returns {Point}
 */
function getCoordinates (evt) {
	return evt.touches
		? { x: evt.touches[0].pageX, y: evt.touches[0].pageY }
		: { x: evt.pageX, y: evt.pageY }
};

/**
 * Applies subtraction between two coordinate objects.
 *
 * @param {Point} c1 - The left-hand object.
 * @param {Point} c2 - The right-hand object.
 * @returns {Point}
 */
function getCoordinateDelta (c1, c2) {
	return {
		x: c1.x - c2.x,
		y: c1.y - c2.y
	};
};

/**
 * Creates a new ViewMatrixTouch instance.
 *
 * @constructor
 * @param {ViewMatrix} instance - The ViewMatrix instance.
 * @param {Object} [o] - Options for the module.
 */
function ViewMatrixTouch (instance, o) {
	var self = this;

	/**
	 * The ViewMatrixTouch instance's default values.
	 * @var {Object}
	 */
	this.defaults = {
		classAlias: 'touching',
		preventDefault: false,
		swipe: false,
		swipeVertical: false,
		swipeTolerance: 30
	};

	/**
	 * The ViewMatrixTouch instance's options.
	 * @var {Object}
	 * @property {String} classAlias - Together with the instance's "classPrefix" option, defines the class to toggle when the element is being touched. Default is "touching".
	 * @property {Boolean} preventDefault - Tells the module it should call preventDefault() when a touch is started. Default is "false".
	 * @property {Boolean} swipe - If true, the module detects swipes in the element and navigates automatically. Default is "false".
	 * @property {Boolean} swipeVertical - If true, the module will handle vertical deltas instead of horizontal. Default is "false".
	 * @property {Number} swipeTolerance - Amount of pixels the delta must be until a swipe is registered. Default is "30".
	 */
	this.options = Utils.prepareInstanceOptions(this.defaults, o);

	// check if it's a valid instance or give up
	instance = Utils.giveInstanceOrDie(instance);

	// shortcut variables
	var touchStart = null;
	var touchLast = null;
	var touchDelta = null;
	var target = null;
	var alias = Utils.isType(self.options.classAlias, 'string', false);

	// callback that is passed to touchmove events,
	// so that touch can be cancelled on the other side
	function cancelTouch (emit) {
		if (alias !== false) {
			instance.toggle(alias, false);
		}

		if (emit !== false) {
			instance.emit('touch:cancel', target, touchLast);
		}

		touchStart = null;
		touchLast = null;
		target = null;
	};

	// event to handle touch start,
	// must check if it's in bounds
	function handleTouchStart (evt) {
		var coords = getCoordinates(evt);

		if (!touchStart && inTargetBounds(instance.element, coords)) {
			touchStart = coords;
			touchLast = coords;
			target = instance.element;

			if (self.options.preventDefault) {
				evt.preventDefault();
			}

			if (alias !== false) {
				instance.toggle(alias, true);
			}

			instance.emit('touch:start', target, coords);
		}
	};

	// event to handle touch move,
	// cancels if touchstart wasn't fired properly
	function handleTouchMove (evt) {
		if (!touchStart) {
			return;
		}

		touchLast = getCoordinates(evt);
		touchDelta = getCoordinateDelta(touchStart, touchLast);

		instance.emit('touch:move', target, touchDelta, cancelTouch);

		if (self.options.swipe && handleTouchSwipe(touchDelta)) {
			cancelTouch(false);
		}
	};

	// method to handle touch swipe,
	// returns true if swipe is applied
	function handleTouchSwipe (touchDelta) {
		var xAbs = Math.abs(touchDelta.x);
		var yAbs = Math.abs(touchDelta.y);
		var delta = 0;

		if (xAbs > yAbs && !self.options.swipeVertical) {
			// swiped horizontally
			delta = touchDelta.x;
		}
		else if (xAbs < yAbs && self.options.swipeVertical) {
			// swiped vertically
			delta = touchDelta.y;
		}

		if (delta > self.options.swipeTolerance) {
			instance.emit('swipe:next', target, touchDelta);
			instance.inc(+1);
			return true;
		}
		else if (delta < -self.options.swipeTolerance) {
			instance.emit('swipe:prev', target, touchDelta);
			instance.inc(-1);
			return true;
		}

		return false;
	};

	// event to handle touch end,
	// just cancels any touching
	function handleTouchEnd (evt) {
		if (!touchStart) {
			return;
		}

		instance.emit('touch:end', target, touchLast);
		cancelTouch(false);
	};

	/**
	 * Binds touch events to the document.
	 */
	this.bindEvents = function () {
		cancelTouch(false);

		// add touch events
		document.addEventListener('touchstart', handleTouchStart, { passive: false });
		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		document.addEventListener('touchend', handleTouchEnd, { passive: false });

		// add mouse events
		document.addEventListener('mousedown', handleTouchStart, { passive: false });
		document.addEventListener('mousemove', handleTouchMove, { passive: false });
		document.addEventListener('mouseup', handleTouchEnd, { passive: false });
	};

	/**
	 * Unbinds touch events from the document.
	 */
	this.unbindEvents = function () {
		cancelTouch(false);

		// cancel touch events
		document.removeEventListener('touchstart', handleTouchStart, { passive: false });
		document.removeEventListener('touchmove', handleTouchMove, { passive: false });
		document.removeEventListener('touchend', handleTouchEnd, { passive: false });

		// cancel mouse events
		document.removeEventListener('mousedown', handleTouchStart, { passive: false });
		document.removeEventListener('mousemove', handleTouchMove, { passive: false });
		document.removeEventListener('mouseup', handleTouchEnd, { passive: false });
	};

	// bind to instance events,
	// so when instance is destroyed/reinitialized
	// then we'll accompany it
	instance.on('initialize', self.bindEvents);
	instance.on('destroy', self.unbindEvents);

	// initialize
	self.bindEvents();
};

module.exports = ViewMatrixTouch;