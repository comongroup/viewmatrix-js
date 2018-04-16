import { merge } from '../utils/objects';
import ViewMatrix from './viewmatrix';

export default abstract class ViewMatrixPlugin<T extends object> {

	/**
	 * Plugin options.
	 */
	public readonly options: T;

	/**
	 * Plugin defaults.
	 */
	protected readonly defaults: T;

	/**
	 * The ViewMatrix instance the plugin belongs to.
	 */
	protected readonly instance: ViewMatrix;

	/**
	 * Creates a new plugin instance.
	 * @param instance The ViewMatrix instance the plugin will belong to.
	 */
	constructor(instance: ViewMatrix, options?: T) {
		this.options = {} as T;
		this.instance = instance;
		this.instance.on('init', this.onInit);
		this.instance.on('destroy', this.onDestroy);
		window.setTimeout(() => { this.applyOptions(options); }, 1); // TODO: not liking this bit right here
	}

	/**
	 * Applies options to the class and starts it up.
	 * @param options Options passed to the class.
	 */
	public applyOptions(options?: T) {
		merge(this.options, this.defaults, options);
		this.onInit();
	}

	/**
	 * Method called when the instance is initialized.
	 */
	protected abstract onInit(): void;

	/**
	 * Method called when the instance is destroyed.
	 */
	protected abstract onDestroy(): void;

}
