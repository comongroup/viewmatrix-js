/**
 * Clamps a given "value" between "min" and "max", so it never overflows.
 * @param value - The value to clamp.
 * @param min - Minimum value, inclusive.
 * @param max - Maximum value, inclusive.
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Wraps a given "value" between "min" and "max", so it never overflows.
 * @param value The value to wrap.
 * @param min Minimum value, inclusive.
 * @param max Maximum value, inclusive.
 */
export function wrap(value: number = 0, min: number = 0, max: number = 0): number {
	// make sure we're using the right max
	max = Math.max(min, max);

	// make math
	const x = value - min;
	const m = (max + 1) - min;
	return min + (x % m + m) % m;
}
