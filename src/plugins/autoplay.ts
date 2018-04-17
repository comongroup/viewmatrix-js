import ViewMatrixPlugin from '../core/viewmatrixplugin';

/**
 * Options that the ViewMatrix Autoplay plugin supports.
 */
export interface IViewMatrixAutoplayOptions {
	/**
	 * Tells the module it should cancel the autoplay when a slide is manually changed. Default is `true`.
	 */
	cancelOnSlide: boolean;
	/**
	 * Together with the instance's `classPrefix` option, defines the class to toggle when autoplaying is enabled. Default is `autoplaying`.
	 */
	classAlias: string;
	/**
	 * Direction increment of the navigation. Default is `+1` = `next`.
	 */
	direction: number;
	/**
	 * Tells the module it should start autoplaying immediately. Default is `true`.
	 */
	instant: boolean;
	/**
	 * Milliseconds it takes to navigate. Default is `3000`.
	 */
	interval: number;
}

export default class ViewMatrixAutoplay extends ViewMatrixPlugin<IViewMatrixAutoplayOptions> {

	/**
	 * The ViewMatrixAutoplay instance's default values.
	 */
	protected readonly defaults = {
		cancelOnSlide: true,
		classAlias: 'autoplaying',
		direction: +1,
		instant: true,
		interval: 3000
	};

	/**
	 * Determines if autoplay should be cancelled when handling a slide change.
	 */
	private cancelAutoplay: boolean = true;

	/**
	 * ID of the setInterval instance.
	 */
	private intervalId: number = 0;

	/**
	 * Starts the autoplay.
	 * @param emit Tells the method it should fire an event or not. Default is `true`.
	 */
	public play(emit?: boolean): void {
		this.pause(false);
		this.intervalId = window.setInterval(this.handleAutoplay, this.options.interval);
		if (this.options.classAlias) {
			this.instance.toggleClass(this.options.classAlias, true);
		}
		if (emit !== false) {
			this.instance.emit('autoplay:start');
		}
	}

	/**
	 * Stops the autoplay.
	 * @param emit Tells the method it should fire an event or not. Default is `true`.
	 */
	public pause(emit?: boolean) {
		if (this.intervalId === 0) {
			return;
		}
		clearInterval(this.intervalId);
		this.intervalId = 0;
		if (this.options.classAlias) {
			this.instance.toggleClass(this.options.classAlias, false);
		}
		if (emit !== false) {
			this.instance.emit('autoplay:pause');
		}
	}

	/**
	 * Method called when the instance is initialized.
	 */
	protected onInit(): void {
		this.instance.on('slide:after', this.handleSlideChange);
		if (this.options.instant === true) {
			this.play();
		}
	}

	/**
	 * Method called when the instance is destroyed.
	 */
	protected onDestroy(): void {
		this.instance.off('slide:after', this.handleSlideChange);
		this.pause(false);
	}

	/**
	 * Event handler for when autoplay interval is fired.
	 * Activates the control variable and changes the slide.
	 */
	private handleAutoplay = () => {
		this.cancelAutoplay = false;
		this.instance.inc(this.options.direction);
	}

	/**
	 * Event handler for when a slide is changed.
	 * If the control variable wasn't set to false, pauses the autoplay.
	 */
	private handleSlideChange = () => {
		if (this.cancelAutoplay && this.options.cancelOnSlide !== false) {
			this.pause();
		}
		this.cancelAutoplay = true;
	}

}
