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
	 * Clamps a given "value" between "min" and "max",
	 * so it never overflows.
	 *
	 * @param {Number} value - The value to clamp.
	 * @param {Number} min - Minimum value, inclusive.
	 * @param {Number} max - Maximum value, inclusive.
	 * @returns {Number}
	 */
	clampNumber: function (value, min, max) {
		return Math.max(min, Math.min(max, value));
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
	 * Returns "instance" if the method was given
	 * an instance of ViewMatrix. Throws an exception otherwise.
	 *
	 * @param {ViewMatrix} instance - The instance to check.
	 * @returns {ViewMatrix}
	 * @throws {TypeError}
	 */
	giveInstanceOrDie: function (instance) {
		if (!(instance instanceof ViewMatrix)) {
			throw new TypeError('Method was given an invalid ViewMatrix instance');
		}
		return instance;
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
	 * @param {String|Array<String>} str - The class to remove.
	 */
	removeClassFromElement: function (el, str) {
		var classes = !(str instanceof Array)
			? this.sanitizeString(str).split(' ')
			: str;
		var result = el.className.trim();
		for (var i = 0; i < classes.length; i++) {
			if (result.indexOf(classes[i]) !== -1) {
				result = result.replace(classes[i], '');
			}
		}
		el.className = this.sanitizeString(result);
		if (el.className.length === 0) {
			el.removeAttribute('class');
		}
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
	 * Sets the inline style of an element.
	 * If "null" is provided as the value, the style will be erased.
	 *
	 * @param {Element} el - The element to style.
	 * @param {String} name - The name of the style to add.
	 * @param {any} value - The value for the style. A value of "null" will erase the style.
	 * @returns {String}
	 */
	setElementStyle: function (el, name, value) {
		var style = this.sanitizeString(el.getAttribute('style') || '');
		if (value == null || style.indexOf(name + ':') !== -1) {
			style = style.replace(new RegExp(name + ':[^;]+;', 'g'), '');
		}
		if (value != null) {
			style += name + ':' + value + ';';
		}
		if (style.length > 0) {
			el.setAttribute('style', this.sanitizeString(style));
		}
		else {
			el.removeAttribute('style');
		}
		return style;
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
