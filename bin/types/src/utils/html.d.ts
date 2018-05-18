import Point from './point';
/**
 * Adds a class to a given HTML element.
 * @param el The element to add the class to.
 * @param str The class to add.
 */
export declare function addClassToElement(el: HTMLElement, str: string): void;
/**
 * Returns children inside an element.
 * @param el The element to return children from.
 * @param selector Query selector to filter children.
 */
export declare function findChildrenInElement(el: HTMLElement, selector?: string): HTMLElement[];
/**
 * Returns the bounding rectangle for the target element,
 * but adjusted with the scroll values of the parent.
 * @param el The element to find bounds for.
 * @param parent The parent of the element to check bounds for. Default is "document.body".
 */
export declare function getAbsoluteRect(el: HTMLElement, parent?: HTMLElement): {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
};
/**
 * Checks if the given `coords` are contained within a `target`.
 * @param target The target to check.
 * @param coords The coordinates to check if they're inside the Target.
 */
export declare function inElementBounds(target: HTMLElement, coords: Point): boolean;
/**
 * Removes a class from a given HTML element.
 * @param el The element to remove the class from.
 * @param str The class to remove.
 */
export declare function removeClassFromElement(el: HTMLElement, str: string | string[]): void;
/**
 * Sets the inline style of an element.
 * If "null" is provided as the value, the style will be erased.
 * @param el The element to style.
 * @param name The name of the style to add.
 * @param value The value for the style. A value of "null" will erase the style.
 */
export declare function setElementStyle(el: HTMLElement, name: string, value: any): string;
/**
 * Toggles a class in a given HTML element.
 * The class will be added if the condition is true.
 * It will be removed otherwise.
 * @param el The element to toggle the class in.
 * @param str The class to toggle.
 * @param condition Condition to determine if class is added or removed.
 */
export declare function toggleClassInElement(el: HTMLElement, str: string, condition: boolean): boolean;
