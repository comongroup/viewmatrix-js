/**
 * Merges one or more objects into `target`.
 * @param target The object to merge to.
 * @param sources One or more sources to merge onto `target`.
 */
export declare function merge<T extends object>(target: T, ...sources: T[]): T;
