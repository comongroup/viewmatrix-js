export default class Point {
    /**
     * Returns a Point object from an event's coordinates.
     * @param event The event to extract the coordinates from.
     * @param touchIndex If the event is a TouchEvent, specify which touch should the method read from.
     */
    static getFromEvent(event: MouseEvent | TouchEvent, touchIndex?: number): Point;
    /**
     * Horizontal coordinate.
     */
    x: number;
    /**
     * Vertical coordinate.
     */
    y: number;
    /**
     * Creates a new 2D point.
     * @param x Horizontal coordinate.
     * @param y Vertical coordinate.
     */
    constructor(x?: number, y?: number);
    /**
     * Returns a new instance of the point with the same coordinates.
     */
    clone(): Point;
    /**
     * Modifies the Point instance by adding coordinates from another `point`.
     * @param point The point to add.
     */
    add(point: Point): Point;
    /**
     * Modifies the Point instance by subtracting coordinates from another `point`.
     * @param point The point to subtract.
     */
    sub(point: Point): Point;
    /**
     * Modifies the Point instance by multiplying coordinates from another `point`.
     * @param point The point to multiply.
     */
    multiply(point: Point): Point;
    /**
     * Modifies the Point instance by dividing coordinates from another `point`.
     * @param point The point to divide.
     */
    divide(point: Point): Point;
}
