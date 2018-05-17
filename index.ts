import ViewMatrix from './src/core/viewmatrix';
import AutoplayPlugin from './src/plugins/autoplay';
import TouchSwipePlugin from './src/plugins/touchswipe';
import Emitter from './src/utils/emitter';

export {
	ViewMatrix,
	AutoplayPlugin,
	TouchSwipePlugin,
	Emitter
};

(window as any).ViewMatrix = ViewMatrix;
