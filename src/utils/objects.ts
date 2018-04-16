/**
 * Merges one or more objects into `target`.
 * @param target The object to merge to.
 * @param sources One or more sources to merge onto `target`.
 */
export function merge<T extends object>(target: T, ...sources: T[]): T {
	if (target == null) {
		throw new TypeError('Cannot convert undefined or null to object');
	}
	const to = Object(target);
	for (let index = 1; index < arguments.length; index++) {
		const nextSource = arguments[index];
		if (nextSource != null) {
			for (const nextKey in nextSource) {
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
					to[nextKey] = nextSource[nextKey];
				}
			}
		}
	}
	return to;
}
