module.exports = {

	js: {
		files: [
			'<%= project.src %>/**'
		],
		tasks: [
			'build'
		],
		options: {
			spawn: false
		}
	}

};
