import Point from './point';
import { sanitize } from './string';

/**
 * Adds a class to a given HTML element.
 * @param el The element to add the class to.
 * @param str The class to add.
 */
export function addClassToElement(el: HTMLElement, str: string): void {
	if (!(el instanceof HTMLElement)) { return; }
	const classes = sanitize(str).split(' ');
	let result = el.className.trim();
	for (const c of classes) {
		if (result.indexOf(c) === -1) {
			result = result + ' ' + c;
		}
	}
	el.className = sanitize(result);
}

/**
 * Returns the bounding rectangle for the target element,
 * but adjusted with the scroll values of the parent.
 * @param el The element to find bounds for.
 * @param parent The parent of the element to check bounds for. Default is "document.body".
 */
export function getAbsoluteRect(el: HTMLElement, parent: HTMLElement = document.body) {
	const parentBounds = parent.getBoundingClientRect();
	const elBounds = el.getBoundingClientRect();
	return {
		bottom: elBounds.bottom - parentBounds.top,
		height: elBounds.height,
		left: elBounds.left - parentBounds.left,
		right: elBounds.right - parentBounds.left,
		top: elBounds.top - parentBounds.top,
		width: elBounds.width
	};
}

/**
 * Checks if the given `coords` are contained within a `target`.
 * @param target The target to check.
 * @param coords The coordinates to check if they're inside the Target.
 */
export function inElementBounds(target: HTMLElement, coords: Point) {
	const bounds = getAbsoluteRect(target);
	return target &&
		coords.x >= bounds.left && coords.x <= bounds.right &&
		coords.y >= bounds.top && coords.y <= bounds.bottom;
}

/**
 * Removes a class from a given HTML element.
 * @param el The element to remove the class from.
 * @param str The class to remove.
 */
export function removeClassFromElement(el: HTMLElement, str: string | string[]): void {
	if (!(el instanceof HTMLElement)) { return; }
	const classes = !(str instanceof Array)
		? sanitize(str).split(' ')
		: str;
	let result = el.className.trim();
	for (const c of classes) {
		if (result.indexOf(c) !== -1) {
			result = result.replace(c, '');
		}
	}
	el.className = sanitize(result);
	if (el.className.length === 0) {
		el.removeAttribute('class');
	}
}

/**
 * Sets the inline style of an element.
 * If "null" is provided as the value, the style will be erased.
 * @param el The element to style.
 * @param name The name of the style to add.
 * @param value The value for the style. A value of "null" will erase the style.
 */
export function setElementStyle(el: HTMLElement, name: string, value: any): string {
	let style = sanitize(el.getAttribute('style') || '');
	if (value == null || style.indexOf(name + ':') !== -1) {
		style = style.replace(new RegExp(name + ':[^;]+;', 'g'), '');
	}
	if (value != null) {
		style += name + ':' + value + ';';
	}
	if (style.length > 0) {
		el.setAttribute('style', sanitize(style));
	}
	else {
		el.removeAttribute('style');
	}
	return style;
}

/**
 * Toggles a class in a given HTML element.
 * The class will be added if the condition is true.
 * It will be removed otherwise.
 * @param el The element to toggle the class in.
 * @param str The class to toggle.
 * @param condition Condition to determine if class is added or removed.
 */
export function toggleClassInElement(el: HTMLElement, str: string, condition: boolean): boolean {
	if (condition) {
		addClassToElement(el, str);
	}
	else {
		removeClassFromElement(el, str);
	}
	return condition;
}
