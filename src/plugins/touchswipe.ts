import ViewMatrixPlugin from '../core/viewmatrixplugin';
import { inElementBounds } from '../utils/html';
import Point from '../utils/point';

/**
 * Options that the ViewMatrix Touch plugin supports.
 */
export interface IViewMatrixTouchSwipeOptions {
	/**
	 * Together with the instance's `classPrefix` option, defines the class to toggle when the element is being touched. Default is `touching`.
	 */
	classAlias: string;
	/**
	 * Tells the plugin it should call preventDefault() when a touch is started. Default is `false`.
	 */
	preventDefault: boolean;
	/**
	 * Amount of pixels the delta must be until a swipe is registered. Default is `30`.
	 */
	tolerance: number;
	/**
	 * If true, the plugin will handle vertical deltas instead of horizontal. Default is `false`.
	 */
	vertical: boolean;
}

export default class ViewMatrixTouchSwipe extends ViewMatrixPlugin<IViewMatrixTouchSwipeOptions> {

	/**
	 * The ViewMatrixAutoplay instance's default values.
	 */
	protected readonly defaults = {
		classAlias: 'touching',
		preventDefault: false,
		tolerance: 30,
		vertical: false
	};

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
	 * Method called when the instance is initialized.
	 */
	protected onInit(): void {
		this.cancelTouch(false);

		// add touch events
		document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
		document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
		document.addEventListener('touchend', this.handleTouchEnd, { passive: false });

		// add mouse events
		document.addEventListener('mousedown', this.handleTouchStart, { passive: false });
		document.addEventListener('mousemove', this.handleTouchMove, { passive: false });
		document.addEventListener('mouseup', this.handleTouchEnd, { passive: false });
	}

	/**
	 * Method called when the instance is destroyed.
	 */
	protected onDestroy(): void {
		this.cancelTouch(false);

		// cancel touch events
		document.removeEventListener('touchstart', this.handleTouchStart);
		document.removeEventListener('touchmove', this.handleTouchMove);
		document.removeEventListener('touchend', this.handleTouchEnd);

		// cancel mouse events
		document.removeEventListener('mousedown', this.handleTouchStart);
		document.removeEventListener('mousemove', this.handleTouchMove);
		document.removeEventListener('mouseup', this.handleTouchEnd);
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
			if (this.options.preventDefault) {
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
