'use strict';

// import Emitter and Utils
var Utils = require('./utils');
var Emitter = require('emitter');

/**
 * Creates a new ViewMatrix instance.
 *
 * @constructor
 * @param {String|Element} selector - The target selector.
 * @param {Object} [o] - Options for the instance.
 */
function ViewMatrix (selector, o) {
	// bind events to this
	Emitter(this);

	/**
	 * The ViewMatrix instance's default values.
	 * @var {Object}
	 */
	this.defaults = {
		adjacentCount: 1,
		childSelector: '*',
		classAliases: {
			element: 'element',
			infinite: 'infinite',
			child: 'child',
			current: 'current',
			behind: 'behind',
			ahead: 'ahead',
			beyond: 'beyond'
		},
		classPrefix: 'vm-',
		createTrack: true,
		currentIndex: 0,
		handleZIndex: true,
		infinite: false,
		parentSelector: null,
		wrapIndex: true
	};

	/**
	 * The ViewMatrix instance's options.
	 * @var {Object}
	 */
	this.options = Utils.prepareInstanceOptions(this.defaults, o);

	// frequent class names
	// that we're gonna use a lot
	var clnames = {};
	var prefix = Utils.isType(this.options.classPrefix, 'string', this.defaults.classPrefix);
	var aliases = Utils.isType(this.options.classAliases, 'object', this.defaults.classAliases);
	for (var k in aliases) {
		if (Object.prototype.hasOwnProperty.call(aliases, k)) {
			clnames[k] = prefix + aliases[k];
		}
	}

	/**
	 * The ViewMatrix instance's target element.
	 * @var {Element}
	 */
	this.element = null;

	/**
	 * The ViewMatrix instance's children.
	 * @var {NodeListOf<Element>}
	 */
	this.children = null;

	/**
	 * How many children are in the ViewMatrix.
	 * @var {Number}
	 */
	this.total = 0;

	/**
	 * Current slide index of the ViewMatrix.
	 * @var {Number}
	 */
	this.current = Utils.isType(this.options.currentIndex, 'number', 0);

	/**
	 * Destroys the ViewMatrix's instance.
	 */
	this.destroy = function () {
		// let's optimize
		var child;

		// reset current element
		if (this.element) {
			Utils.removeClassFromElement(this.element, [ clnames.element, clnames.infinite ]);
		}

		// reset current children
		if (this.children && this.children.length > 0) {
			for (var i = 0; i < this.children.length; i++) {
				child = this.children[i];
				Utils.removeClassFromElement(child, [ clnames.child, clnames.current, clnames.beyond, clnames.behind, clnames.ahead ] );
				Utils.setElementStyle(child, 'z-index', null);
			}
		}

		// trigger event
		this.emit('destroy', this.element, this.children);

		// reset vars
		this.element = null;
		this.children = null;
	};

	/**
	 * Refreshes the ViewMatrix's instance.
	 *
	 * @param {String|Element} selector - The query selector to find the element.
	 * @param {String} [childSelector] - An optional query selector to filter children.
	 */
	this.refresh = function (selector, childSelector) {
		// let's optimize
		var child;

		// destroy first
		this.destroy();

		// get a valid selector
		selector = selector != null
			? selector
			: this.options.parentSelector;

		// check if we have an object,
		// if we do, POPULATE ALL THE VARS
		if (typeof selector === 'string') {
			this.element = document.querySelector(selector) || null;
		}
		else if (selector instanceof Element) {
			this.element = selector;
		}

		// do we still have a target?
		// if not, throw a hissy fit
		if (!this.element) {
			throw new Error('No valid selector provided to ViewMatrix');
		}

		// set children, total and index
		// (also update the childSelector in the options to this one)
		this.options.parentSelector = selector;
		this.options.childSelector = Utils.isType(childSelector, 'string', this.options.childSelector);
		this.children = Utils.findChildrenInElement(this.element, this.options.childSelector);
		this.total = this.children.length;
		this.current = this.wrap(this.current);

		// add classes to new children
		for (var i = 0; i < this.children.length; i++) {
			child = this.children[i];
			Utils.addClassToElement(child, clnames.child);
		}

		// refresh slides
		this.slide(this.current);

		// add classes to the element
		Utils.addClassToElement(this.element, clnames.element);
		Utils.toggleClassInElement(this.element, clnames.infinite, this.options.infinite);

		// trigger event
		this.emit('initialize', this.element, this.children);
	};

	/**
	 * Changes the ViewMatrix's current slide.
	 *
	 * @param {Number} index - Slide to change to.
	 * @returns {HTMLElement}
	 */
	this.slide = function (index) {
		if (!this.children || this.children.length === 0) return null;

		// let's optimize
		var child;
		var distance;
		var isAhead;
		var isBehind;
		var isBeyond;

		// wrap index for safety
		index = this.wrap(index);

		// calc adjacent and distance values
		var adjacentCount = Math.max(1, this.options.adjacentCount);
		var distanceCount = Math.floor((this.children.length - 1) / 2);
		var indexCount = distanceCount + (this.children.length % 2 == 0 ? 1 : 0);

		// trigger before event
		this.emit('slide:before', this.current, index, this.total);

		// add or remove classes from children
		for (var i = 0; i < this.children.length; i++) {
			child = this.children[i];
			distance = i - index;

			if (this.options.infinite) {
				// if we're looping around in an infinite gallery,
				// we loop the distance as well
				if (distance > distanceCount) {
					distance -= this.children.length;
				}
				else if (distance < -distanceCount) {
					distance += this.children.length;
				}
			}

			if (i === index) {
				// this is the new current element
				// remove all old classes and add the "vm-current" one
				Utils.removeClassFromElement(child, [ clnames.ahead, clnames.behind, clnames.beyond ]);
				Utils.addClassToElement(child, clnames.current);
			}
			else {
				// this is not a current element,
				// figure out if it's before or after
				isAhead = distance > 0;
				isBehind = distance < 0;

				// check if it's beyond the adjacent scope
				isBeyond = Math.abs(distance) > adjacentCount;

				// remove "current" and toggle other classes
				Utils.removeClassFromElement(child, clnames.current);
				Utils.toggleClassInElement(child, clnames.beyond, isBeyond);
				Utils.toggleClassInElement(child, clnames.behind, isBehind);
				Utils.toggleClassInElement(child, clnames.ahead, isAhead);
			}

			// if we're handling z-index, fix it
			if (this.options.handleZIndex) {
				Utils.setElementStyle(child, 'z-index', indexCount - Math.abs(distance));
			}
		}

		// trigger event
		this.emit('slide', this.current, index, this.total);

		// set new index
		this.current = index;

		return this.children[index];
	};

	/**
	 * Increments the ViewMatrix's current slide.
	 *
	 * @param {Number} inc - Value to add to the current index.
	 * @returns {HTMLElement}
	 */
	this.inc = function (inc) {
		return this.slide(this.current + Utils.isType(inc, 'number', 0));
	};


	this.toggle = function (name, condition) {
		if (this.element) {
			Utils.toggleClassInElement(this.element, prefix + name, condition);
		}
	};


	/**
	 * Wraps a given "index" to be safe.
	 *
	 * @param {Number} index - Index to wrap.
	 * @returns {Number}
	 */
	this.wrap = function (index) {
		var max = this.total - 1;
		return this.options.wrapIndex
			? Utils.wrapNumber(index, 0, max)
			: Utils.clampNumber(index, 0, max);
	};

	// initialize the container
	this.refresh(selector, this.options.childSelector);

	// return reference
	return this;
};

// expose ViewMatrix class
module.exports = ViewMatrix;
