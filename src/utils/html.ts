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
 * Returns children inside an element.
 * @param el The element to return children from.
 * @param selector Query selector to filter children.
 */
export function findChildrenInElement(el: HTMLElement, selector?: string): HTMLElement[] {
	return typeof selector === 'string'
		? [].slice.call(el.querySelectorAll(':scope > ' + selector))
		: el.children;
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
