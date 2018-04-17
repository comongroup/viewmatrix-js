interface IStringDictionary { [id: string]: string; }

/**
 * Class aliases that ViewMatrix supports for its elements.
 */
export default interface IViewMatrixClassAliases extends IStringDictionary {
	element: string;
	infinite: string;
	child: string;
	current: string;
	behind: string;
	ahead: string;
	beyond: string;
}
