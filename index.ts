import ViewMatrix from './src/core/viewmatrix';
import AutoplayPlugin from './src/plugins/autoplay';
import TouchSwipePlugin from './src/plugins/touchswipe';

(ViewMatrix as any).AutoplayPlugin = AutoplayPlugin;
(ViewMatrix as any).TouchSwipePlugin = TouchSwipePlugin;

export default ViewMatrix;
