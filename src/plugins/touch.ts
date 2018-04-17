import ViewMatrixPlugin from '../core/viewmatrixplugin';
import Point from '../utils/point';

/**
 * Checks if the given `coords` are contained within a `target`.
 * @param target The target to check.
 * @param coords The coordinates to check if they're inside the Target.
 */
function inTargetBounds(target: HTMLElement, coords: Point) {
	return target &&
		coords.x >= target.offsetLeft && coords.x <= target.offsetLeft + target.offsetWidth &&
		coords.y >= target.offsetTop && coords.y <= target.offsetTop + target.offsetHeight;
}

/**
 * Returns a Point object from an event's coordinates.
 * If the event has any touches, it returns the first touch's coordinates.
 * @param event The event to extract the coordinates from.
 */
function getCoordinates(event: MouseEvent | TouchEvent): Point {
	const point = new Point();
	if (event instanceof TouchEvent && event.touches) {
		point.x = event.touches[0].pageX;
		point.y = event.touches[0].pageY;
	}
	else if (event instanceof MouseEvent) {
		point.x = event.pageX;
		point.y = event.pageY;
	}
	return point;
}

/**
 * Options that the ViewMatrix Touch plugin supports.
 */
export interface IViewMatrixTouchOptions {
	/**
	 * Together with the instance's `classPrefix` option, defines the class to toggle when the element is being touched. Default is `touching`.
	 */
	classAlias: string;
	/**
	 * Tells the plugin it should call preventDefault() when a touch is started. Default is `false`.
	 */
	preventDefault: boolean;
	/**
	 * If true, the plugin detects swipes in the element and navigates automatically. Default is `false`.
	 */
	swipe: boolean;
	/**
	 * - If true, the plugin will handle vertical deltas instead of horizontal. Default is `false`.
	 */
	swipeVertical: boolean;
	/**
	 * Amount of pixels the delta must be until a swipe is registered. Default is `30`.
	 */
	swipeTolerance: number;
}

export default class ViewMatrixTouch extends ViewMatrixPlugin<IViewMatrixTouchOptions> {

	/**
	 * The ViewMatrixAutoplay instance's default values.
	 */
	protected readonly defaults = {
		classAlias: 'touching',
		preventDefault: false,
		swipe: false,
		swipeVertical: false,
		swipeTolerance: 30
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
		const coords = getCoordinates(event);
		if (!this.touchStart && inTargetBounds(this.instance.element, coords)) {
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
		this.touchLast = getCoordinates(event);
		this.touchDelta = this.touchStart.clone().sub(this.touchLast);
		this.instance.emit('touch:move', this.target, this.touchDelta, this.cancelTouch);
		if (this.options.swipe && this.handleTouchSwipe(this.touchDelta)) {
			this.cancelTouch(false);
		}
	}

	/**
	 * Handles swiping in the element.
	 * Returns true if a swipe is applied and touch needs to be cancelled.
	 * @param touchDelta Touch delta needed to figure out if swipe should be applied.
	 */
	private handleTouchSwipe(touchDelta: Point): boolean {
		const xAbs = Math.abs(touchDelta.x);
		const yAbs = Math.abs(touchDelta.y);
		let delta = 0;
		if (xAbs > yAbs && !this.options.swipeVertical) {
			// swiped horizontally
			delta = touchDelta.x;
		}
		else if (xAbs < yAbs && this.options.swipeVertical) {
			// swiped vertically
			delta = touchDelta.y;
		}
		if (delta > this.options.swipeTolerance) {
			this.instance.emit('swipe:next', this.target, touchDelta);
			this.instance.inc(+1);
			return true;
		}
		else if (delta < -this.options.swipeTolerance) {
			this.instance.emit('swipe:prev', this.target, touchDelta);
			this.instance.inc(-1);
			return true;
		}
		return false;
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
