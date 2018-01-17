;(function (scope, $) { // TODO: remove jquery from here
	'use strict';

	var Utils = {

		// shortcut method to check if "v" is of "type",
		// and if not, returns "d" (or null if "d" is undefined)
		isType: function (v, type, d) {
			d = typeof d !== 'undefined' ? d : null;
			return typeof v === type ? v : d;
		},

		// shortcut method to add a class to an element
		addClassToElement: function (el, className) {
			$(el).addClass(className); // FIXME: make this not dependent on jquery
		},

		// shortcut method to remove a class from an element
		removeClassFromElement: function (el, className) {
			$(el).removeClass(className); // FIXME: make this not dependent on jquery
		},

		// shortcut method to toggle a method in a class
		toggleClassInElement: function (el, className, condition) {
			$(el).toggleClass(className, condition); // FIXME: make this not dependent on jquery
		},

		// shortcut method to get all children from an element
		findChildrenInElement: function (el, selector) {
			return selector ? el.querySelectorAll(':scope > ' + selector) : el.children;
		},

		// returns "instance" if it's a valid ViewMatrix,
		// and throws an exception if it's not
		// TODO: is this really necessary?
		giveInstanceOrDie: function (instance) {
			if (instance instanceof ViewMatrix) {
				return instance;
			}
			throw new Error('Method was given an invalid ViewMatrix instance');
		},

		// wraps "value" between min and max
		wrapNumber: function (value, min, max) {
			// filter out vars
			value = this.isType(value, 'number', 0);
			min = this.isType(min, 'number', 0);
			max = Math.max(min, this.isType(max, 'number', 0));

			var x = value - min;
			var m = (max + 1) - min;
			return min + (x % m + m) % m;
		}

	};

	// TODO: documentation
	function ViewMatrix (target, o) {
		var _ = this;

		// set default options
		_.defaults = {
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

		// create options object to access throughout the class
		_.options = Object.assign(_.defaults, typeof o === 'object' ? o : {});

		// instances and indexes
		_.target = null;
		_.total = 0;
		_.current = Utils.isType(_.options.currentIndex, 'number', 0);
		_.clnames = {};

		// check if we have an object,
		// if we do, POPULATE ALL THE VARS
		if (typeof target === 'string') {
			_.target = document.querySelector(target) || null;
		}

		// do we still have a target?
		// if not, throw a hissy fit
		if (!_.target) {
			throw new Error('No valid target provided to ViewMatrix');
		}

		// frequent class names
		// that we're gonna use a lot
		var prefix = Utils.isType(_.options.classPrefix, 'string', _.defaults.classPrefix);
		var suffixes = Utils.isType(_.options.classSuffixes, 'object', _.defaults.classSuffixes);
		for (var k in suffixes) {
			if (suffixes.hasOwnProperty(k)) {
				_.clnames[k] = prefix + suffixes[k];
			}
		}

		// get children
		var children = _.refreshChildren(_.options.childSelector);

		setTimeout(function () {
			// add "element" class a bit after,
			// so that transitions don't start right away
			Utils.addClassToElement(_.target, _.clnames.element);
		}, 10);

		// return reference
		return _;
	};

	// TODO: documentation
	// wraps a given index to be safe
	ViewMatrix.prototype.wrapIndex = function (index) {
		var _ = Utils.giveInstanceOrDie(this);
		return Utils.wrapNumber(index, 0, _.total - 1);
	};

	// TODO: documentation
	// returns the children from the target
	ViewMatrix.prototype.refreshChildren = function (selector) {
		var _ = Utils.giveInstanceOrDie(this);
		var children = Utils.findChildrenInElement(_.target, selector);

		// reset any children if there are any
		if (_.children && _.children.length > 0) {
			for (var i = 0; i < _.children.length; i++) {
				var child = _.children[i];
				Utils.removeClassFromElement(child, _.clnames.child);
				Utils.removeClassFromElement(child, _.clnames.current);
				Utils.removeClassFromElement(child, _.clnames.behind);
				Utils.removeClassFromElement(child, _.clnames.ahead);
			}
		}

		// set children, total and index
		_.children = children;
		_.total = children.length;
		_.current = _.wrapIndex(_.current);
		_.options.childSelector = selector;

		// add classes to new children
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			Utils.addClassToElement(child, _.clnames.child);
		}

		// refresh slides
		_.slide(_.current);

		// return the children
		return _.children;
	};

	// TODO: documentation
	// changes the current slide
	ViewMatrix.prototype.slide = function (index) {
		var _ = Utils.giveInstanceOrDie(this);

		// get current children, and cancel if empty
		var children = _.children;
		if (children.length === 0) return null;

		// wrap index for safety
		index = _.wrapIndex(index);

		// add or remove classes from children
		for (var i = 0; i < children.length; i++) {
			var child = children[i];

			if (i === index) {
				Utils.removeClassFromElement(child, _.clnames.behind);
				Utils.removeClassFromElement(child, _.clnames.ahead);
				Utils.addClassToElement(child, _.clnames.current);
			}
			else {
				Utils.removeClassFromElement(child, _.clnames.current);
				Utils.toggleClassInElement(child, _.clnames.behind, i < index);
				Utils.toggleClassInElement(child, _.clnames.ahead, i > index);
			}
		}

		// set new index
		_.current = index;
		return children[index];
	};

	// TODO: documentation
	// changes to slide index + inc
	ViewMatrix.prototype.inc = function (inc) {
		var _ = Utils.giveInstanceOrDie(this);
		return _.slide(_.current + Utils.isType(inc, 'number', 0));
	};

	// send class to given scope
	scope.ViewMatrix = ViewMatrix;

})(window, $);