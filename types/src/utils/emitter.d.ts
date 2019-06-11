export declare type EmitterCallback = (...args: any[]) => void;
export default abstract class Emitter {
    /**
     * List of callbacks maintained by the class.
     */
    private callbacks;
    /**
     * Listens on the given `event` with `callback`.
     * @param event The event to add the listener to.
     * @param callback Listener to invoke.
     */
    on(event: string, callback: EmitterCallback): Emitter;
    /**
     * Adds an `event` listener that will be invoked a single time then automatically removed.
     * @param event The event to add the listener to.
     * @param callback Listener to invoke.
     */
    once(event: string, callback: EmitterCallback): Emitter;
    /**
     * Removes the given callback for `event` or all registered callbacks.
     * @param event The event to remove the listener(s) from.
     * @param callback Specific listener to remove.
     */
    off(event?: string, callback?: EmitterCallback): Emitter;
    /**
     * Emits `event` with the given `args`.
     * @param event The event to trigger.
     * @param args Arguments to pass to each callback.
     */
    emit(event: string, ...args: any[]): Emitter;
    /**
     * Returns an array of callbacks for `event`.
     * @param event The event to get the listeners from.
     */
    listeners(event: string): EmitterCallback[];
    /**
     * Checks if this emitter has `event` handlers.
     * @param event The event to verify.
     */
    hasListeners(event: string): boolean;
}
