/**
 * Clears all extra spaces in a string.
 * @param str String to sanitize.
 */
export function sanitize(str: string): string {
	return ('' + str).trim().replace(/\s\s+/g, ' ');
}
