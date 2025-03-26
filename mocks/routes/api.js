const api = require('../fixtures/api.json');

module.exports = [{
	id: "get-api",
	url: "/api",
	method: "GET",
	variants: [{
			id: "json",
			type: "json",
			options: {
				status: 200,
				body: api
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