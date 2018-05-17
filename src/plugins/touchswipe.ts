import ViewMatrixPlugin from '../core/viewmatrixplugin';
import { inElementBounds } from '../utils/html';
import { merge } from '../utils/objects';
import Point from '../utils/point';

/**
 * Options that the ViewMatrix Touch plugin supports.
 */
export interface ITouchSwipePluginOptions {
	/**
	 * Together with the instance's `classPrefix` option, defines the class to toggle when the element is being touched. Default is `touching`.
	 */
	classAlias?: string;
	/**
	 * Tells the plugin what elements it should add touch event listeners to.
	 */
	eventTarget?: Document | Element;
	/**
	 * Tells the plugin it should call preventDefault() when a touch is started. Default is `false`.
	 */
	preventDefault?: boolean;
	/**
	 * Amount of pixels the delta must be until a swipe is registered. Default is `30`.
	 */
	tolerance?: number;
	/**
	 * If true, the plugin will handle vertical deltas instead of horizontal. Default is `false`.
	 */
	vertical?: boolean;
}

export default class TouchSwipePlugin extends ViewMatrixPlugin {

	/**
	 * The instance's options.
	 */
	public readonly options: ITouchSwipePluginOptions = {};

	/**
	 * The instance's default values.
	 */
	private readonly defaults: ITouchSwipePluginOptions = {
		classAlias: 'touching',
		eventTarget: document,
		preventDefault: true,
		tolerance: 30,
		vertical: false
	};

	/**
	 * Determines which was the last event target.
	 */
	private eventTarget?: Document | Element = undefined;

	/**
	 * Point with starting touch coordinates.
	 */
	private touchStart?: Point = undefined;

	/**
	 * Point with last touch coordinates.
	 */
	private touchLast?: Point = undefined;

	/**
	 * Point with difference between start and last touch coordinates.
	 */
	private touchDelta?: Point = undefined;

	/**
	 * Current touch target.
	 */
	private target?: HTMLElement = undefined;

	/**
	 * Initializes a new TouchSwipePlugin instance.
	 * @param options Options for the plugin.
	 */
	public constructor(options?: ITouchSwipePluginOptions) {
		super();
		merge(this.options, this.defaults, options);
	}

	/**
	 * Method called when the instance is initialized.
	 */
	public onInit(): void {
		this.cancelTouch(false);

		// setup event target for future events
		this.eventTarget = this.options.eventTarget;

		if (this.eventTarget) {
			// add touch events
			this.eventTarget.addEventListener('touchstart', this.handleTouchStart, { passive: false });
			this.eventTarget.addEventListener('touchmove', this.handleTouchMove, { passive: false });
			this.eventTarget.addEventListener('touchend', this.handleTouchEnd, { passive: false });

			// add mouse events
			this.eventTarget.addEventListener('mousedown', this.handleTouchStart, { passive: false });
			this.eventTarget.addEventListener('mousemove', this.handleTouchMove, { passive: false });
			this.eventTarget.addEventListener('mouseup', this.handleTouchEnd, { passive: false });
		}
	}

	/**
	 * Method called when the instance is destroyed.
	 */
	public onDestroy(): void {
		this.cancelTouch(false);

		if (this.eventTarget) {
			// cancel touch events
			this.eventTarget.removeEventListener('touchstart', this.handleTouchStart);
			this.eventTarget.removeEventListener('touchmove', this.handleTouchMove);
			this.eventTarget.removeEventListener('touchend', this.handleTouchEnd);

			// cancel mouse events
			this.eventTarget.removeEventListener('mousedown', this.handleTouchStart);
			this.eventTarget.removeEventListener('mousemove', this.handleTouchMove);
			this.eventTarget.removeEventListener('mouseup', this.handleTouchEnd);

			// nullify the event target because we don't need it anymore
			this.eventTarget = undefined;
		}
	}

	/**
	 * Callback that is passed to touchmove events, so that touch can be cancelled on the other side.
	 * @param emit Tells the method it should fire an event or not. Default is `true`.
	 */
	private cancelTouch = (emit?: boolean) => {
		if (this.options.classAlias) {
			this.instance.toggleClass(this.options.classAlias, false);
		}
		if (emit !== false) {
			this.instance.emit('touch:cancel', this.target, this.touchLast);
		}
		this.touchStart = undefined;
		this.touchLast = undefined;
		this.target = undefined;
	}

	/**
	 * Handles touchStart or mouseDown events.
	 * @param event The event to extract the coordinates from.
	 */
	private handleTouchStart = (event: MouseEvent | TouchEvent) => {
		const coords = Point.getFromEvent(event);
		if (!this.touchStart && inElementBounds(this.instance.element, coords)) {
			this.touchStart = coords;
			this.touchLast = coords;
			this.target = this.instance.element;
			if (this.options.preventDefault && event.cancelable) {
				event.preventDefault();
			}
			if (this.options.classAlias) {
				this.instance.toggleClass(this.options.classAlias, true);
			}
			this.instance.emit('touch:start', this.target, coords);
		}
	}

	/**
	 * Handles touchMove or mouseMove events.
	 * @param event The event to extract the coordinates from.
	 */
	private handleTouchMove = (event: MouseEvent | TouchEvent) => {
		if (!this.touchStart) { return; }
		this.touchLast = Point.getFromEvent(event);
		this.touchDelta = this.touchStart.clone().sub(this.touchLast);
		this.instance.emit('touch:move', this.target, this.touchDelta, this.cancelTouch);

		const xAbs = Math.abs(this.touchDelta.x);
		const yAbs = Math.abs(this.touchDelta.y);
		let delta = 0;

		if (xAbs > yAbs && !this.options.vertical) {
			// swiped horizontally
			delta = this.touchDelta.x;
		}
		else if (xAbs < yAbs && this.options.vertical) {
			// swiped vertically
			delta = this.touchDelta.y;
		}

		if (delta > this.options.tolerance) {
			this.instance.emit('swipe:next', this.target, this.touchDelta);
			this.instance.inc(+1);
			this.cancelTouch(false);
		}
		else if (delta < -this.options.tolerance) {
			this.instance.emit('swipe:prev', this.target, this.touchDelta);
			this.instance.inc(-1);
			this.cancelTouch(false);
		}
	}

	/**
	 * Handles touchEnd or mouseUp events.
	 * @param event The event to extract the coordinates from.
	 */
	private handleTouchEnd = (event: MouseEvent | TouchEvent) => {
		if (!this.touchStart) { return; }
		this.instance.emit('touch:end', this.target, this.touchLast);
		this.cancelTouch(false);
	}

}
