import IViewMatrixClassAliases from './iviewmatrixclassaliases';

/**
 * Options that ViewMatrix supports.
 */
export default interface IViewMatrixOptions {
	startingIndex: number;
	childrenSelector: string;
	classAliases: IViewMatrixClassAliases;
	classPrefix: string;
	adjacentCount: number;
	handleZIndex: boolean;
	infinite: boolean;
	wrap: boolean;
}
