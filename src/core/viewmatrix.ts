import AutoplayPlugin from '../plugins/autoplay';
import TouchSwipePlugin from '../plugins/touchswipe';
import Emitter from '../utils/emitter';
import { addClassToElement, removeClassFromElement, setElementStyle, toggleClassInElement } from '../utils/html';
import { clamp, wrap } from '../utils/math';
import { merge } from '../utils/objects';
import IViewMatrixClassAliases from './iviewmatrixclassaliases';
import IViewMatrixOptions from './iviewmatrixoptions';
import ViewMatrixPlugin from './viewmatrixplugin';

export interface IPluginDictionary {
	[id: string]: typeof ViewMatrixPlugin;
}

export type PluginConstructor = (p: IPluginDictionary) => ViewMatrixPlugin[];

export default class ViewMatrix extends Emitter {

	/** The instance's target element. */
	public element: HTMLElement;

	/** The instance's options. */
	public readonly options: IViewMatrixOptions;

	/** The instance's children. */
	private children: HTMLElement[] = null;

	/** List of ViewMatrixPlugin instances associated with the instance. */
	private plugins: ViewMatrixPlugin[] = [];

	/** The class' instance defaults. */
	private readonly defaults: IViewMatrixOptions = {
		// state init
		startingIndex: 0,
		// classes
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
		// function
		adjacentCount: 1,
		handleZIndex: true,
		infinite: false,
		wrap: true
	};

	/** List of class names frequently used for children elements. */
	private classAliases: { [id: string]: string } = {};

	/** Current slide's index. */
	private currentIndex: number = 0;

	/**
	 * Creates a new ViewMatrix instance.
	 * @param rootSelector The target selector or element for the instance.
	 * @param options Options for the instance.
	 * @param plugins Plugins for the instance.
	 */
	constructor(
		rootSelector: string | HTMLElement,
		options?: IViewMatrixOptions,
		plugins?: ViewMatrixPlugin[] | PluginConstructor
	) {
		super();

		// get options
		this.options = merge({}, this.defaults, options);

		// load plugins
		if (plugins) {
			if (plugins instanceof Array) {
				this.plugins = Array.prototype.slice.call(plugins, 1);
			}
			else if (typeof plugins === 'function') {
				this.plugins = plugins({
					AutoplayPlugin,
					TouchSwipePlugin
				});
			}
		}

		// initialize
		this.initialize(rootSelector);
	}

	/**
	 * Refreshes the instance.
	 * @param rootSelector The query selector to find the element.
	 */
	public initialize(rootSelector: string | HTMLElement): void {
		// destroy first
		this.destroy();

		// get a valid root selector
		rootSelector = rootSelector != null ? rootSelector : null;

		// check if we have an object,
		// if we do, POPULATE ALL THE VARS
		if (typeof rootSelector === 'string') {
			this.element = document.querySelector(rootSelector) || null;
		}
		else if (rootSelector instanceof HTMLElement) {
			this.element = rootSelector;
		}

		// do we still have a target?
		// if not, throw a hissy fit
		if (!this.element) {
			throw new Error('No valid element or selector provided to ViewMatrix instance');
		}

		// set children and index
		this.children = [].slice.call(this.element.children) as HTMLElement[];
		this.currentIndex = this.wrapIndex(this.currentIndex);

		// add classes to new children
		this.prepareClassNames(this.options.classPrefix, this.options.classAliases);
		for (const child of this.children) {
			addClassToElement(child, this.classAliases.child);
		}

		// add classes to the element
		addClassToElement(this.element, this.classAliases.element);
		toggleClassInElement(this.element, this.classAliases.infinite, this.options.infinite);

		// initialize plugins
		this.initializePlugins();

		// refresh slides
		this.slide(this.currentIndex);

		// trigger event
		this.emit('init', this.element, this.children);
	}

	/**
	 * Destroys the ViewMatrix instance.
	 */
	public destroy(): void {
		// reset all plugins
		this.destroyPlugins();

		// reset current element
		if (this.element) {
			removeClassFromElement(this.element, [
				this.classAliases.element,
				this.classAliases.infinite
			]);
		}

		// reset current children
		if (this.children && this.children.length > 0) {
			for (const child of this.children) {
				removeClassFromElement(child, [
					this.classAliases.child,
					this.classAliases.current,
					this.classAliases.beyond,
					this.classAliases.behind,
					this.classAliases.ahead
				] );
				setElementStyle(child, 'z-index', null);
			}
		}

		// trigger event
		this.emit('destroy', this.element, this.children);

		// reset vars
		this.element = null;
		this.children = null;
	}

	/**
	 * Changes the ViewMatrix's current slide.
	 * @param index Slide to change to.
	 */
	public slide(index: number): HTMLElement {
		if (!this.children || this.children.length === 0) { return null; }

		// wrap index for safety
		index = this.wrapIndex(index);

		// calc adjacent and distance values
		const childrenCount = this.children.length;
		const adjacentCount = Math.max(1, this.options.adjacentCount);
		const distanceCount = Math.floor((childrenCount - 1) / 2);
		const indexCount = distanceCount + (childrenCount % 2 === 0 ? 1 : 0);

		// trigger before event
		this.emit('slide:before', this.currentIndex, index, childrenCount);

		// add or remove classes from children
		for (let i = 0; i < childrenCount; i++) {
			const child = this.children[i];
			let distance = i - index;

			if (this.options.infinite) {
				// if we're looping around in an infinite gallery,
				// we loop the distance as well
				if (distance > distanceCount) {
					distance -= childrenCount;
				}
				else if (distance < -distanceCount) {
					distance += childrenCount;
				}
			}

			if (i === index) {
				// this is the new current element
				// remove all old classes and add the "vm-current" one
				removeClassFromElement(child, [
					this.classAliases.ahead,
					this.classAliases.behind,
					this.classAliases.beyond
				]);
				addClassToElement(child, this.classAliases.current);
			}
			else {
				// this is not a current element,
				// figure out if it's before or after
				const isAhead = distance > 0;
				const isBehind = distance < 0;

				// check if it's beyond the adjacent scope
				const isBeyond = Math.abs(distance) > adjacentCount;

				// remove "current" and toggle other classes
				removeClassFromElement(child, this.classAliases.current);
				toggleClassInElement(child, this.classAliases.beyond, isBeyond);
				toggleClassInElement(child, this.classAliases.behind, isBehind);
				toggleClassInElement(child, this.classAliases.ahead, isAhead);
			}

			// if we're handling z-index, fix it
			if (this.options.handleZIndex) {
				setElementStyle(child, 'z-index', indexCount - Math.abs(distance));
			}
		}

		// trigger event
		this.emit('slide:after', this.currentIndex, index, childrenCount);

		// set new index
		this.currentIndex = index;

		// return child element
		return this.children[index];
	}

	/**
	 * Increments the ViewMatrix's current slide.
	 * @param inc Value to add to the current index.
	 */
	public inc(increment: number): HTMLElement {
		return this.slide(this.currentIndex + increment);
	}

	/**
	 * Toggles a class in the instance's element.
	 * @param name The class to toggle.
	 * @param condition Condition to determine if class is added or removed.
	 */
	public toggleClass(name: string, condition: boolean): void {
		if (this.element) {
			toggleClassInElement(this.element, this.options.classPrefix + name, condition);
		}
	}

	/**
	 * Caches all class names for future use.
	 * @param prefix Prefix for all class aliases.
	 * @param aliases String dictionary of class aliases.
	 */
	private prepareClassNames(prefix: string = this.options.classPrefix, aliases: IViewMatrixClassAliases = this.options.classAliases): void {
		for (const k in aliases) {
			if (Object.prototype.hasOwnProperty.call(aliases, k)) {
				this.classAliases[k] = prefix + aliases[k];
			}
		}
	}

	/**
	 * Wraps a given "index" to be safe for the instance to use.
	 * @param index Index to wrap.
	 */
	private wrapIndex(index: number): number {
		return this.options.wrap
			? wrap(index, 0, this.children.length)
			: clamp(index, 0, this.children.length);
	}

	/**
	 * Invokes the `onInit` method on all registered plugins.
	 */
	private initializePlugins(): void {
		for (const p of this.plugins) {
			if (p) {
				p.instance = this;
				if (typeof p.onInit === 'function') {
					p.onInit();
				}
			}
		}
	}

	/**
	 * Invokes the `onDestroy` method on all registered plugins.
	 */
	private destroyPlugins(): void {
		for (const p of this.plugins) {
			if (p && p.instance) {
				if (typeof p.onDestroy === 'function') {
					p.onDestroy();
				}
				p.instance = null;
			}
		}
	}

}
