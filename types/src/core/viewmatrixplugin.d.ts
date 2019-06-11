import ViewMatrix from './viewmatrix';
export default abstract class ViewMatrixPlugin {
    /**
     * The ViewMatrix instance the plugin belongs to.
     */
    instance: ViewMatrix;
    /**
     * Method called when the instance is initialized.
     */
    abstract onInit(): void;
    /**
     * Method called when the instance is destroyed.
     */
    abstract onDestroy(): void;
}
