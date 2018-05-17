import ViewMatrix from './src/core/viewmatrix';
import AutoplayPlugin from './src/plugins/autoplay';
import TouchSwipePlugin from './src/plugins/touchswipe';

export {
	ViewMatrix,
	AutoplayPlugin,
	TouchSwipePlugin
};

(window as any).ViewMatrix = ViewMatrix;
