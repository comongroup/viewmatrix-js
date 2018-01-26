var Utils = require('./utils');

/**
 * Creates a new ViewMatrixAutoplay instance.
 *
 * @constructor
 * @param {ViewMatrix} instance - The ViewMatrix instance.
 * @param {Object} [o] - Options for the module.
 */
function ViewMatrixAutoplay (instance, o) {
	var self = this;

	/**
	 * The ViewMatrixAutoplay instance's default values.
	 * @var {Object}
	 */
	this.defaults = {
		cancelOnSlide: true,
		classAlias: 'autoplaying',
		direction: +1,
		instant: true,
		interval: 3
	};

	/**
	 * The ViewMatrixAutoplay instance's options.
	 * @var {Object}
	 * @property {Boolean} cancelOnSlide - Tells the module it should cancel the autoplay when a slide is manually changed. Default is "true".
	 * @property {String} classAlias - Together with the instance's "classPrefix" option, defines the class to toggle when autoplaying is enabled. Default is "autoplaying".
	 * @property {Number} direction - Direction increment of the navigation. Default is "+1" = "next".
	 * @property {Boolean} instant - Tells the module it should start autoplaying immediately. Default is "true".
	 * @property {Number} interval - Seconds it takes to navigate. Default is "2".
	 */
	this.options = Utils.prepareInstanceOptions(this.defaults, o);

	// check if it's a valid instance or give up
	instance = Utils.giveInstanceOrDie(instance);

	// shortcut variables
	var interval = null;
	var cancel = false;
	var alias = Utils.isType(self.options.classAlias, 'string', false);

	// event handler for when autoplay interval is fired,
	// basically activates the control variable and changes the slide
	function handleAutoplay () {
		cancel = true;
		instance.inc(self.options.direction);
	};

	// event handler for when a slide is changed,
	// if the control variable wasn't set, pauses the autoplay
	function handleSlideChange () {
		if (!cancel && self.options.cancelOnSlide !== false) {
			self.pause();
		}
		cancel = false;
	};

	/**
	 * Starts the autoplay.
	 *
	 * @param {Boolean} emit - Tells the method it should fire an event or not. Default is "true".
	 */
	this.play = function (emit) {
		self.pause(false);
		interval = setInterval(handleAutoplay, Utils.isType(self.options.interval, 'number', 3) * 1000);

		if (alias !== false) {
			instance.toggle(alias, true);
		}

		if (emit !== false) {
			instance.emit('autoplay:start');
		}
	};

	/**
	 * Stops the autoplay.
	 *
	 * @param {Boolean} emit - Tells the method it should fire an event or not. Default is "true".
	 */
	this.pause = function (emit) {
		if (interval == null) {
			return;
		}

		clearInterval(interval);
		interval = null;

		if (self.options.classAlias) {
			instance.toggle(alias, false);
		}

		if (emit !== false) {
			instance.emit('autoplay:pause');
		}
	};

	/**
	 * Binds callbacks to ViewMatrix events.
	 */
	this.bindEvents = function () {
		instance.on('slide', handleSlideChange);
	};

	/**
	 * Unbinds callbacks from ViewMatrix events.
	 */
	this.unbindEvents = function () {
		instance.off('slide', handleSlideChange);
		self.stop(false);
	};

	// bind to instance events,
	// so when instance is destroyed/reinitialized
	// then we'll accompany it
	instance.on('initialize', self.bindEvents);
	instance.on('destroy', self.unbindEvents);

	// initialize
	self.bindEvents();
	if (self.options.instant === true) {
		self.play();
	}
};

module.exports = ViewMatrixAutoplay;
