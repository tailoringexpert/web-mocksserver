let notes = require('../fixtures/notes.json');

module.exports = [{
	id: "get-notes",
	url: "/api/project/:project/tailoring/:tailoring/note",
	method: "GET",
	variants: [{
			id: "json",
			type: "json",
			options: {
				status: 200,
				body: notes
			}
		},
		{
			id: "proxy",
			type: "proxy",
			options: {
				host: "${process.env.API_PROXY}",
			}
		}
	]
}]