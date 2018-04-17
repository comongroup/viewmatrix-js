const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');

const resolve = function(dir) {
	return path.join(__dirname, dir)
};

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {

	mode: 'production',
	devtool: 'source-map',

	entry: {
		viewmatrix: './src/index.ts'
	},

	output: {
		path: resolve('bin'),
		filename: './[name].min.js'
	},

	module: {
		rules: [

			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader',
					options: {
						configFile: resolve('tsconfig.json'),
						happyPackMode: true,
						transpileOnly: true
					}
				}
			}

		]
	},

	plugins: [
		new CleanWebpackPlugin(['public']),
		new ForkTsCheckerWebpackPlugin({
			checkSyntacticErrors: true
		}),
		new webpack.BannerPlugin({
			banner: `name: [name]\nversion: ${package.version}\nhash: [hash]`
		})
	],

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json']
	}

};
