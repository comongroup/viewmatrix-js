const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function resolve(dir) {
	return path.join(__dirname, dir)
};

module.exports = {

	mode: 'production',
	devtool: 'source-map',

	entry: {
		viewmatrix: './index.ts'
	},

	output: {
		path: resolve('dist'),
		filename: './[name].min.js',
		library: 'ViewMatrix',
		libraryExport: 'default'
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader',
					options: {
						configFile: resolve('tsconfig.json')
					}
				}
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(),
		new webpack.BannerPlugin({
			banner: `name: [name]\nversion: ${package.version}\nhash: [hash]`
		})
	],

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json']
	}

};
