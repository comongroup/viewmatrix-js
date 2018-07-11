import ViewMatrixPlugin from '../core/viewmatrixplugin';
/**
 * Options that the ViewMatrix Touch plugin supports.
 */
export interface ITouchSwipePluginOptions {
    /**
     * Together with the instance's `classPrefix` option, defines the class to toggle when the element is being touched. Default is `touching`.
     */
    classAlias?: string;
    /**
     * Tells the plugin what elements it should add touch event listeners to.
     */
    eventTarget?: Document | Element;
    /**
     * Tells the plugin it should call preventDefault() when a touch is started. Default is `false`.
     */
    preventDefault?: boolean;
    /**
     * Amount of pixels the delta must be until a swipe is registered. Default is `30`.
     */
    tolerance?: number;
    /**
     * If true, the plugin will handle vertical deltas instead of horizontal. Default is `false`.
     */
    vertical?: boolean;
}
export default class TouchSwipePlugin extends ViewMatrixPlugin {
    /**
     * The instance's options.
     */
    readonly options: ITouchSwipePluginOptions;
    /**
     * The instance's default values.
     */
    private readonly defaults;
    /**
     * Determines which was the last event target.
     */
    private eventTarget?;
    /**
     * Point with starting touch coordinates.
     */
    private touchStart?;
    /**
     * Point with last touch coordinates.
     */
    private touchLast?;
    /**
     * Point with difference between start and last touch coordinates.
     */
    private touchDelta?;
    /**
     * Initializes a new TouchSwipePlugin instance.
     * @param options Options for the plugin.
     */
    constructor(options?: ITouchSwipePluginOptions);
    /**
     * Method called when the instance is initialized.
     */
    onInit(): void;
    /**
     * Method called when the instance is destroyed.
     */
    onDestroy(): void;
    /**
     * Callback that is passed to touchmove events, so that touch can be cancelled on the other side.
     * @param emit Tells the method it should fire an event or not. Default is `true`.
     */
    private cancelTouch;
    /**
     * Handles touchStart or mouseDown events.
     * @param event The event to extract the coordinates from.
     */
    private handleTouchStart;
    /**
     * Handles touchMove or mouseMove events.
     * @param event The event to extract the coordinates from.
     */
    private handleTouchMove;
    /**
     * Handles touchEnd or mouseUp events.
     * @param event The event to extract the coordinates from.
     */
    private handleTouchEnd;
}
