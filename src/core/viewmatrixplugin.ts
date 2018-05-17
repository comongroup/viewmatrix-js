import ViewMatrix from './viewmatrix';

export default abstract class ViewMatrixPlugin {

	/**
	 * The ViewMatrix instance the plugin belongs to.
	 */
	public instance: ViewMatrix;

	/**
	 * Method called when the instance is initialized.
	 */
	public abstract onInit(): void;

	/**
	 * Method called when the instance is destroyed.
	 */
	public abstract onDestroy(): void;

}
