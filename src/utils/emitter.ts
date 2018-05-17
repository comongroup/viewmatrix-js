// based off of component-emitter package
// https://github.com/component/emitter

export type EmitterCallback = (...args: any[]) => void;

export default abstract class Emitter {

	/**
	 * List of callbacks maintained by the class.
	 */
	private callbacks: { [id: string]: EmitterCallback[] } = {};

	/**
	 * Listens on the given `event` with `callback`.
	 * @param event The event to add the listener to.
	 * @param callback Listener to invoke.
	 */
	public on(event: string, callback: EmitterCallback): Emitter {
		if (typeof callback !== 'function') { return this; }
		const key = '$' + event;
		(this.callbacks[key] = this.callbacks[key] || []).push(callback);
		return this;
	}

	/**
	 * Adds an `event` listener that will be invoked a single time then automatically removed.
	 * @param event The event to add the listener to.
	 * @param callback Listener to invoke.
	 */
	public once(event: string, callback: EmitterCallback): Emitter {
		if (typeof callback !== 'function') { return this; }
		function on() {
			this.off(event, on);
			callback.apply(this, arguments);
		}
		(on as any).callback = callback;
		this.on(event, on);
		return this;
	}

	/**
	 * Removes the given callback for `event` or all registered callbacks.
	 * @param event The event to remove the listener(s) from.
	 * @param callback Specific listener to remove.
	 */
	public off(event?: string, callback?: EmitterCallback): Emitter {
		// remove all events
		if (arguments.length === 0) {
			this.callbacks = {};
			return this;
		}

		// remove specific event
		const key = '$' + event;
		const callbacks = this.callbacks[key];
		if (!callbacks) {
			return this;
		}

		// remove all handlers
		if (arguments.length === 1) {
			delete this.callbacks[key];
			return this;
		}

		// remove specific handler
		const index = callbacks.indexOf(callback);
		if (index !== -1 && callbacks[index] === callback) {
			callbacks.splice(index, 1);
		}

		// remove event-specific arrays without callbacks
		// to avoid memory leaks
		if (callbacks.length === 0) {
			delete this.callbacks[key];
		}

		return this;
	}

	/**
	 * Emits `event` with the given `args`.
	 * @param event The event to trigger.
	 * @param args Arguments to pass to each callback.
	 */
	public emit(event: string, ...args: any[]): Emitter {
		let callbacks = this.callbacks['$' + event];
		if (callbacks && callbacks.length > 0) {
			callbacks = callbacks.slice(0);
			for (const c of callbacks) {
				c.apply(this, args);
			}
		}
		return this;
	}

	/**
	 * Returns an array of callbacks for `event`.
	 * @param event The event to get the listeners from.
	 */
	public listeners(event: string): EmitterCallback[] {
		return this.callbacks['$' + event] || [];
	}

	/**
	 * Checks if this emitter has `event` handlers.
	 * @param event The event to verify.
	 */
	public hasListeners(event: string): boolean {
		return !!this.listeners(event).length;
	}

}
