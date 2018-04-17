export default class Point {

	/**
	 * Returns a Point object from an event's coordinates.
	 * @param event The event to extract the coordinates from.
	 * @param touchIndex If the event is a TouchEvent, specify which touch should the method read from.
	 */
	public static getFromEvent(event: MouseEvent | TouchEvent, touchIndex: number = 0): Point {
		const point = new Point();
		if (event instanceof TouchEvent && event.touches) {
			point.x = event.touches[touchIndex].pageX;
			point.y = event.touches[touchIndex].pageY;
		}
		else if (event instanceof MouseEvent) {
			point.x = event.pageX;
			point.y = event.pageY;
		}
		return point;
	}

	/**
	 * Horizontal coordinate.
	 */
	public x: number;

	/**
	 * Vertical coordinate.
	 */
	public y: number;

	/**
	 * Creates a new 2D point.
	 * @param x Horizontal coordinate.
	 * @param y Vertical coordinate.
	 */
	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Returns a new instance of the point with the same coordinates.
	 */
	public clone(): Point {
		return new Point(this.x, this.y);
	}

	/**
	 * Modifies the Point instance by adding coordinates from another `point`.
	 * @param point The point to add.
	 */
	public add(point: Point): Point {
		this.x += point.x;
		this.y += point.y;
		return this;
	}

	/**
	 * Modifies the Point instance by subtracting coordinates from another `point`.
	 * @param point The point to subtract.
	 */
	public sub(point: Point): Point {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	}

	/**
	 * Modifies the Point instance by multiplying coordinates from another `point`.
	 * @param point The point to multiply.
	 */
	public multiply(point: Point): Point {
		this.x *= point.x;
		this.y *= point.y;
		return this;
	}

	/**
	 * Modifies the Point instance by dividing coordinates from another `point`.
	 * @param point The point to divide.
	 */
	public divide(point: Point): Point {
		this.x /= point.x;
		this.y /= point.y;
		return this;
	}

}
