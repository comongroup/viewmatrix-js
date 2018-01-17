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
	/**
	 * The ViewMatrix instance's default values.
	 * @var {Object}
	 */
	this.defaults = {
		childSelector: 'img',
		classPrefix: 'vm-',
		classSuffixes: {
			element: 'element',
			child: 'child',
			current: 'current',
			behind: 'behind',
			ahead: 'ahead',
			beyond: 'beyond'
		},
		createTrack: true,
		currentIndex: 0
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
	 * Refreshes the VM
	 *
	 * @param {String|Element} selector - The query selector to find the element.
	 * @param {String} [childSelector] - An optional query selector to filter children.
	 */
	this.refresh = function (selector, childSelector) {
		// let's optimize
		var child;

		// reset current element
		if (this.element) {
			Utils.removeClassFromElement(child, clnames.element);
		}

		// reset current children
		if (this.children && this.children.length > 0) {
			for (var i = 0; i < this.children.length; i++) {
				child = this.children[i];
				Utils.removeClassFromElement(child, clnames.child);
				Utils.removeClassFromElement(child, clnames.current);
				Utils.removeClassFromElement(child, clnames.behind);
				Utils.removeClassFromElement(child, clnames.ahead);
			}
		}

		// reset vars
		this.element = null;
		this.children = null;

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
		this.children = Utils.findChildrenInElement(this.element, childSelector);
		this.total = this.children.length;
		this.current = this.wrap(this.current);
		this.options.childSelector = childSelector;

		// add classes to new children
		for (var i = 0; i < this.children.length; i++) {
			child = this.children[i];
			Utils.addClassToElement(child, clnames.child);
		}

		// refresh slides
		this.slide(this.current);

		// add classes to the element
		Utils.addClassToElement(this.element, clnames.element);
	};

	/**
	 * Changes the ViewMatrix's current slide.
	 *
	 * @param {Number} index - Slide to change to.
	 * @returns {HTMLElement}
	 */
	this.slide = function (index) {
		// get current children, and cancel if empty
		var children = this.children;
		if (children.length === 0) return null;

		// let's optimize
		var child;

		// wrap index for safety
		index = this.wrap(index);

		// add or remove classes from children
		for (var i = 0; i < children.length; i++) {
			child = children[i];

			if (i === index) {
				Utils.removeClassFromElement(child, clnames.behind);
				Utils.removeClassFromElement(child, clnames.ahead);
				Utils.addClassToElement(child, clnames.current);
			}
			else {
				Utils.removeClassFromElement(child, clnames.current);
				Utils.toggleClassInElement(child, clnames.behind, i < index);
				Utils.toggleClassInElement(child, clnames.ahead, i > index);
			}
		}

		// set new index
		this.current = index;
		return children[index];
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
		return Utils.wrapNumber(index, 0, this.total - 1);
	};

	// initialize the container
	this.refresh(selector, this.options.childSelector);

	// return reference
	return this;
};

// expose ViewMatrix class
module.exports = ViewMatrix;
