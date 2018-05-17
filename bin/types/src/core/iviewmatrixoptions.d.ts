import IViewMatrixClassAliases from './iviewmatrixclassaliases';
/**
 * Options that ViewMatrix supports.
 */
export default interface IViewMatrixOptions {
    /**
     * Controls the number of elements on each side of the current slide's until the `beyond` class alias is applied.
     */
    adjacentCount?: number;
    /**
     * Optional selector for selecting children inside the main element.
     */
    childrenSelector?: string;
    /**
     * Class aliases that should be applied.
     */
    classAliases?: IViewMatrixClassAliases;
    /**
     * Prefix for the applied class aliases.
     */
    classPrefix?: string;
    /**
     * Defines if the ViewMatrix should manage each element's z-index property.
     */
    handleZIndex?: boolean;
    /**
     * Defines if slides should loop or not.
     * ViewMatrix then adds the corresponding classes to the elements that need to stay before or after the current slide.
     */
    infinite?: boolean;
    /**
     * Index that the instance should start with. Default is `0`.
     */
    startingIndex?: number;
    /**
     * Defines if the instance should wrap around when incrementing beyond the limits.
     * If `false`, the instance will not apply changes if `inc(-1)` is applied when the current slide index is 0,
     * or if `inc(+1)` is applied when the current slide is `children.length - 1`.
     */
    wrap?: boolean;
}
