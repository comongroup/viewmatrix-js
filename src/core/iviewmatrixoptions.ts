import IViewMatrixClassAliases from './iviewmatrixclassaliases';

/**
 * Options that ViewMatrix supports.
 */
export default interface IViewMatrixOptions {
	adjacentCount: number;
	childrenSelector: string;
	classAliases: IViewMatrixClassAliases;
	classPrefix: string;
	handleZIndex: boolean;
	infinite: boolean;
	startingIndex: number;
	wrap: boolean;
}
