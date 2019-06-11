/**
 * Clamps a given "value" between "min" and "max", so it never overflows.
 * @param value The value to clamp.
 * @param min Minimum value, inclusive.
 * @param max Maximum value, inclusive.
 */
export function clamp(value: number, min: number = 0, max: number = 1): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Wraps a given "value" between "min" and "max", so it never overflows.
 * @param value The value to wrap.
 * @param min Minimum value, inclusive.
 * @param max Maximum value, exclusive.
 */
export function wrap(value: number = 0, min: number = 0, max: number = 1): number {
	// make sure we're using the right max
	max = Math.max(min, max);

	// make math
	const x = value - min;
	const m = max - min;
	return min + (x % m + m) % m;
}
