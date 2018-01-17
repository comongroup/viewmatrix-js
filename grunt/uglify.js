module.exports = {

	bin: {
		options: {
			sourceMap: true,
			banner:
				'/*\n' +
				' * <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>)\n' +
				' * @author <%= pkg.author %>\n' +
				' */\n'
		},
		files: {
			'<%= project.bin %>/viewmatrix.min.js': [
				'<%= project.bin %>/viewmatrix.js'
			]
		}
	}

};
