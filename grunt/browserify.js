module.exports = {

	bin: {
		options: {
			force: true,
			alias: {
				'emitter': '<%= project.node %>/component-emitter/index.js'
			},
			banner:
				'/*\n' +
				' * <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>)\n' +
				' * @author <%= pkg.author %>\n' +
				' */\n\n'
		},
		files: {
			'<%= project.bin %>/viewmatrix.js': [
				'<%= project.root %>/index.js'
			]
		}
	}

};
