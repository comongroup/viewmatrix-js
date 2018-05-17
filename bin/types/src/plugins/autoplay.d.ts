import ViewMatrixPlugin from '../core/viewmatrixplugin';
/**
 * Options that the ViewMatrix Autoplay plugin supports.
 */
export interface IAutoplayPluginOptions {
    /**
     * Tells the module it should cancel the autoplay when a slide is manually changed. Default is `true`.
     */
    cancelOnSlide?: boolean;
    /**
     * Together with the instance's `classPrefix` option, defines the class to toggle when autoplaying is enabled. Default is `autoplaying`.
     */
    classAlias?: string;
    /**
     * Direction increment of the navigation. Default is `+1` = `next`.
     */
    direction?: number;
    /**
     * Tells the module it should start autoplaying immediately. Default is `true`.
     */
    instant?: boolean;
    /**
     * Milliseconds it takes to navigate. Default is `3000`.
     */
    interval?: number;
}
export default class AutoplayPlugin extends ViewMatrixPlugin {
    /**
     * The instance's options.
     */
    readonly options: IAutoplayPluginOptions;
    /**
     * The instance's default values.
     */
    protected readonly defaults: IAutoplayPluginOptions;
    /**
     * Determines if autoplay should be cancelled when handling a slide change.
     */
    private cancelAutoplay;
    /**
     * ID of the setInterval instance.
     */
    private intervalId;
    /**
     * Initializes a new TouchSwipePlugin instance.
     * @param options Options for the plugin.
     */
    constructor(options?: IAutoplayPluginOptions);
    /**
     * Method called when the instance is initialized.
     */
    onInit(): void;
    /**
     * Method called when the instance is destroyed.
     */
    onDestroy(): void;
    /**
     * Starts the autoplay.
     * @param emit Tells the method it should fire an event or not. Default is `true`.
     */
    play(emit?: boolean): void;
    /**
     * Stops the autoplay.
     * @param emit Tells the method it should fire an event or not. Default is `true`.
     */
    pause(emit?: boolean): void;
    /**
     * Event handler for when autoplay interval is fired.
     * Activates the control variable and changes the slide.
     */
    private handleAutoplay;
    /**
     * Event handler for when a slide is changed.
     * If the control variable wasn't set to false, pauses the autoplay.
     */
    private handleSlideChange;
}
