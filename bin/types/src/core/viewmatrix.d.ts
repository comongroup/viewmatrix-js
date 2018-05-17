import Emitter from '../utils/emitter';
import IViewMatrixOptions from './iviewmatrixoptions';
import ViewMatrixPlugin from './viewmatrixplugin';
export interface IPluginDictionary {
    [id: string]: typeof ViewMatrixPlugin;
}
export declare type PluginConstructor = (p: IPluginDictionary) => ViewMatrixPlugin[];
export default class ViewMatrix extends Emitter {
    /**
     * The instance's target element.
     */
    element: HTMLElement;
    /**
     * The instance's options.
     */
    readonly options: IViewMatrixOptions;
    /**
     * The ViewMatrix instance's children.
     */
    private children;
    /**
     * List of ViewMatrixPlugin instances associated with the instance.
     */
    private plugins;
    /**
     * The class' instance defaults.
     */
    private readonly defaults;
    /**
     * List of class names frequently used for children elements.
     */
    private classAliases;
    /**
     * Current slide's index.
     */
    private currentIndex;
    /**
     * Creates a new ViewMatrix instance.
     * @param selector The target selector or element for the instance.
     * @param options Options for the instance.
     */
    constructor(parentSelector: string | HTMLElement, options?: IViewMatrixOptions, plugins?: ViewMatrixPlugin[] | PluginConstructor);
    /**
     * Refreshes the instance.
     * @param parentSelector The query selector to find the element.
     * @param childrenSelector An optional query selector to filter children.
     */
    initialize(parentSelector: string | HTMLElement, childrenSelector?: string): void;
    /**
     * Destroys the ViewMatrix instance.
     */
    destroy(): void;
    /**
     * Changes the ViewMatrix's current slide.
     * @param index Slide to change to.
     */
    slide(index: number): HTMLElement;
    /**
     * Increments the ViewMatrix's current slide.
     * @param inc Value to add to the current index.
     */
    inc(increment: number): HTMLElement;
    /**
     * Toggles a class in the instance's element.
     * @param name The class to toggle.
     * @param condition Condition to determine if class is added or removed.
     */
    toggleClass(name: string, condition: boolean): void;
    /**
     * Caches all class names for future use.
     * @param prefix Prefix for all class aliases.
     * @param aliases String dictionary of class aliases.
     */
    private prepareClassNames(prefix?, aliases?);
    /**
     * Wraps a given "index" to be safe for the instance to use.
     * @param index Index to wrap.
     */
    private wrapIndex(index);
    /**
     * Invokes the `onInit` method on all registered plugins.
     */
    private initializePlugins();
    /**
     * Invokes the `onDestroy` method on all registered plugins.
     */
    private destroyPlugins();
}
