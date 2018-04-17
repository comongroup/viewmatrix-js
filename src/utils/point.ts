export default class Point {

	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	public clone(): Point {
		return new Point(this.x, this.y);
	}

	public add(point: Point): Point {
		this.x += point.x;
		this.y += point.y;
		return this;
	}

	public sub(point: Point): Point {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	}

	public mult(point: Point): Point {
		this.x *= point.x;
		this.y *= point.y;
		return this;
	}

	public div(point: Point): Point {
		this.x /= point.x;
		this.y /= point.y;
		return this;
	}

}
