/**
 * Clamps a given "value" between "min" and "max", so it never overflows.
 * @param value The value to clamp.
 * @param min Minimum value, inclusive.
 * @param max Maximum value, inclusive.
 */
export declare function clamp(value: number, min?: number, max?: number): number;
/**
 * Wraps a given "value" between "min" and "max", so it never overflows.
 * @param value The value to wrap.
 * @param min Minimum value, inclusive.
 * @param max Maximum value, exclusive.
 */
export declare function wrap(value?: number, min?: number, max?: number): number;
