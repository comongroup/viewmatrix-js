export interface IStringDictionary { [id: string]: string; }

/**
 * Class aliases that ViewMatrix supports for its elements.
 */
export default interface IViewMatrixClassAliases extends IStringDictionary {
	/**
	 * Class that should be applied to the main element.
	 */
	element: string;
	/**
	 * Additional class that should be applied when the element is in infinite mode.
	 */
	infinite: string;
	/**
	 * Class that should be applied to a valid child managed by the ViewMatrix instance.
	 */
	child: string;
	/**
	 * Additional class that should be applied to the current child slide.
	 */
	current: string;
	/**
	 * Additional class that should be applied to a slide that should be behind the current one.
	 */
	behind: string;
	/**
	 * Additional class that should be applied to a slide that should be ahead the current one.
	 */
	ahead: string;
	/**
	 * Additional class that should be applied to a slide that is beyond the
	 * defined `adjacentCount` option, either behind or ahead of the current one.
	 */
	beyond: string;
}
