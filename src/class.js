import { Utils } from './utils';

/**
 * Creates a new ViewMatrix instance.
 *
 * @constructor
 * @param {String} selector - The target selector.
 * @param {Object} [o] - Options for the instance.
 */
function ViewMatrix (selector, o) {
	var self = this;

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
			ahead: 'ahead'
		},
		createTrack: true,
		currentIndex: 0
	};

	/**
	 * The ViewMatrix instance's options.
	 * @var {Object}
	 */
	this.options = Utils.mergeObjects(this.defaults, Utils.isType(o, 'object', {}));

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

	// common class names
	// (not documented, cause why should they be)
	this.clnames = {};

	// check if we have an object,
	// if we do, POPULATE ALL THE VARS
	if (typeof selector === 'string') {
		this.element = document.querySelector(selector) || null;
	}

	// do we still have a target?
	// if not, throw a hissy fit
	if (!this.element) {
		throw new Error('No valid selector provided to ViewMatrix');
	}

	// frequent class names
	// that we're gonna use a lot
	var prefix = Utils.isType(this.options.classPrefix, 'string', this.defaults.classPrefix);
	var suffixes = Utils.isType(this.options.classSuffixes, 'object', this.defaults.classSuffixes);
	for (var k in suffixes) {
		if (Object.prototype.hasOwnProperty.call(suffixes, k)) {
			this.clnames[k] = prefix + suffixes[k];
		}
	}

	// get children
	var children = this.refreshChildren(this.options.childSelector);

	setTimeout(function () {
		// add "element" class a bit after,
		// so that transitions don't start right away
		Utils.addClassToElement(self.element, self.clnames.element);
	}, 10);

	// return reference
	return this;
};

/**
 * Wraps a given "index" to be safe.
 *
 * @param {Number} index - Index to wrap.
 * @returns {Number}
 */
ViewMatrix.prototype.wrapIndex = function (index) {
	var _ = Utils.giveInstanceOrDie(this);
	return Utils.wrapNumber(index, 0, this.total - 1);
};

/**
 * Returns the children from the current element.
 *
 * @param {String} [selector] - An optional query selector to filter children.
 * @returns {NodeListOf<Element>}
 */
ViewMatrix.prototype.refreshChildren = function (selector) {
	var children = Utils.findChildrenInElement(this.element, selector);

	// reset any children if there are any
	if (this.children && this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			Utils.removeClassFromElement(child, this.clnames.child);
			Utils.removeClassFromElement(child, this.clnames.current);
			Utils.removeClassFromElement(child, this.clnames.behind);
			Utils.removeClassFromElement(child, this.clnames.ahead);
		}
	}

	// set children, total and index
	this.children = children;
	this.total = children.length;
	this.current = this.wrapIndex(this.current);
	this.options.childSelector = selector;

	// let's optimize
	var child;

	// add classes to new children
	for (var i = 0; i < children.length; i++) {
		child = children[i];
		Utils.addClassToElement(child, this.clnames.child);
	}

	// refresh slides
	this.slide(this.current);

	// return the children
	return children;
};

/**
 * Changes the ViewMatrix's current slide.
 *
 * @param {Number} index - Slide to change to.
 * @returns {HTMLElement}
 */
ViewMatrix.prototype.slide = function (index) {
	// get current children, and cancel if empty
	var children = this.children;
	if (children.length === 0) return null;

	// wrap index for safety
	index = this.wrapIndex(index);

	// let's optimize
	var child;

	// add or remove classes from children
	for (var i = 0; i < children.length; i++) {
		child = children[i];

		if (i === index) {
			Utils.removeClassFromElement(child, this.clnames.behind);
			Utils.removeClassFromElement(child, this.clnames.ahead);
			Utils.addClassToElement(child, this.clnames.current);
		}
		else {
			Utils.removeClassFromElement(child, this.clnames.current);
			Utils.toggleClassInElement(child, this.clnames.behind, i < index);
			Utils.toggleClassInElement(child, this.clnames.ahead, i > index);
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
ViewMatrix.prototype.inc = function (inc) {
	return this.slide(this.current + Utils.isType(inc, 'number', 0));
};

// export class
export { ViewMatrix };
