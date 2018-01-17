'use strict';

module.exports = function (grunt) {

	var path = require('path');

	require('time-grunt')(grunt);
	require('load-grunt-config')(grunt, {
		configPath: path.join(process.cwd(), 'grunt')
	});

};
