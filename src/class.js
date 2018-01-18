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
		classPrefix: 'vm-',
		classSuffixes: {
			element: 'element',
			infinite: 'infinite',
			child: 'child',
			current: 'current',
			behind: 'behind',
			ahead: 'ahead',
			beyond: 'beyond'
		},
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
	this.options = Utils.mergeObjects(this.defaults, Utils.isType(o, 'object', {}));

	// frequent class names
	// that we're gonna use a lot
	var clnames = {};
	var prefix = Utils.isType(this.options.classPrefix, 'string', this.defaults.classPrefix);
	var suffixes = Utils.isType(this.options.classSuffixes, 'object', this.defaults.classSuffixes);
	for (var k in suffixes) {
		if (Object.prototype.hasOwnProperty.call(suffixes, k)) {
			clnames[k] = prefix + suffixes[k];
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
		this.emit('destroyed', this.element, this.children);

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
		this.emit('initialized', this.element, this.children);
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
		var offset;
		var isAhead;
		var isBehind;
		var isBeyond;

		// wrap index for safety
		index = this.wrap(index);

		// calc values for infinity
		var adjacentCount = Math.max(1, this.options.adjacentCount);
		var lowerLimit = adjacentCount;
		var upperLimit = this.children.length - adjacentCount;
		var isNearStart = index < adjacentCount;
		var isNearEnd = index >= upperLimit;

		// trigger before event
		this.emit('beforeslide', this.current, index, this.total);

		// add or remove classes from children
		for (var i = 0; i < this.children.length; i++) {
			child = this.children[i];
			offset = Math.abs(index - i);

			if (i === index) {
				// this is the new current element
				// remove all old classes and add the "vm-current" one
				Utils.removeClassFromElement(child, [ clnames.ahead, clnames.behind, clnames.beyond ]);
				Utils.addClassToElement(child, clnames.current);
			}
			else {
				// this is not a current element,
				// figure out if it's before or after
				isAhead = i > index;
				isBehind = i < index;

				// handling infinity (stones)?
				// check if the item should be on the opposite side of where it'd normally be
				if (this.options.infinite) {
					if (isNearStart && i >= upperLimit) {
						offset = Math.abs(index - (i - this.children.length));
						isAhead = false;
						isBehind = true;
					}
					else if (isNearEnd && i < lowerLimit) {
						offset = Math.abs(index - (i + this.children.length));
						isAhead = true;
						isBehind = false;
					}
				}

				// check if it's beyond the adjacent scope
				isBeyond = offset > adjacentCount;

				// remove "current" and toggle other classes
				Utils.removeClassFromElement(child, clnames.current);
				Utils.toggleClassInElement(child, clnames.beyond, isBeyond);
				Utils.toggleClassInElement(child, clnames.behind, isBehind);
				Utils.toggleClassInElement(child, clnames.ahead, isAhead);
			}

			// if we're handling z-index, fix it
			if (this.options.handleZIndex) {
				Utils.setElementStyle(child, 'z-index', this.children.length - offset);
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
