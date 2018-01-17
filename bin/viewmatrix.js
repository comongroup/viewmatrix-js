/*
 * viewmatrix-js v0.0.1 (2018-01-17 20:49:36)
 * @author comOn Group
 */


require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (scope) {

	scope.ViewMatrix = require('./src/class');

})(window);

},{"./src/class":2}],2:[function(require,module,exports){
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

},{"./utils":3,"emitter":"emitter"}],3:[function(require,module,exports){
'use strict';

var Utils = {

	/**
	 * Adds a class to a given HTML element.
	 *
	 * @param {Element} el - The element to add the class to.
	 * @param {String} str - The class to add.
	 */
	addClassToElement: function (el, str) {
		var classes = this.sanitizeString(str).split(' ');
		var result = el.className.trim();
		for (var i = 0; i < classes.length; i++) {
			if (result.indexOf(classes[i]) === -1) {
				result = result + ' ' + classes[i];
			}
		}
		el.className = this.sanitizeString(result);
	},

	/**
	 * Returns children inside an element.
	 *
	 * @param {Element} el - The element to return children from.
	 * @param {String} [selector] - An optional query selector to filter children.
	 * @returns {NodeListOf<Element>}
	 */
	findChildrenInElement: function (el, selector) {
		return this.isType(selector, 'string')
			? el.querySelectorAll(':scope > ' + selector)
			: el.querySelectorAll('*');
	},

	/**
	 * Checks if "v" is of given "type",
	 * and if not, returns "d" (or null if "d" is undefined).
	 *
	 * @param {any} v - The value to check.
	 * @param {String} type - The type the value is supposed to be.
	 * @param {any} [d] - Default value if the check fails.
	 * @returns {any}
	 */
	isType: function (v, type, d) {
		d = typeof d !== 'undefined' ? d : null;
		return typeof v === type ? v : d;
	},

	/**
	 * Merges one or more objects into "target".
	 *
	 * @param {Object} target - The target to merge to.
	 * @param {...Object} sources - One or more sources to merge from.
	 * @returns {Object}
	 * @throws {TypeError}
	 */
	mergeObjects: function (target) {
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}
		var to = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];
			if (nextSource != null) {
				for (var nextKey in nextSource) {
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	},

	/**
	 * Removes a class from a given HTML element.
	 *
	 * @param {Element} el - The element to remove the class from.
	 * @param {String} str - The class to remove.
	 */
	removeClassFromElement: function (el, str) {
		var classes = this.sanitizeString(str).split(' ');
		var result = el.className.trim();
		for (var i = 0; i < classes.length; i++) {
			if (result.indexOf(classes[i]) !== -1) {
				console.log('remove', classes[i], 'from', result);
				result = result.replace(classes[i], '');
			}
		}
		el.className = this.sanitizeString(result);
	},

	/**
	 * Clears all extra spaces in a string.
	 *
	 * @param {String} str - String to sanitize.
	 * @returns {String}
	 */
	sanitizeString: function (str) {
		return this.isType(str, 'string', '').trim().replace(/\s\s+/g, ' ');
	},

	/**
	 * Toggles a class in a given HTML element.
	 * The class will be added if the condition is true.
	 * It will be removed otherwise.
	 *
	 * @param {Element} el - The element to toggle the class in.
	 * @param {String} str - The class to toggle.
	 * @param {Boolean} condition - Condition to determine if class is added or removed.
	 * @returns {Boolean}
	 */
	toggleClassInElement: function (el, str, condition) {
		if (condition) {
			this.addClassToElement(el, str);
		}
		else {
			this.removeClassFromElement(el, str);
		}
		return condition;
	},

	/**
	 * Wraps a given "value" between "min" and "max",
	 * so it never overflows.
	 *
	 * @param {Number} value - The value to wrap.
	 * @param {Number} min - Minimum value, inclusive.
	 * @param {Number} max - Maximum value, inclusive.
	 * @returns {Number}
	 */
	wrapNumber: function (value, min, max) {
		// filter out vars
		value = this.isType(value, 'number', 0);
		min = this.isType(min, 'number', 0);
		max = Math.max(min, this.isType(max, 'number', 0));

		// make math
		var x = value - min;
		var m = (max + 1) - min;
		return min + (x % m + m) % m;
	}

};

// export object
module.exports = Utils;

},{}],"emitter":[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}]},{},[1]);
