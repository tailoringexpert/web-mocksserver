const profiles = require('../fixtures/selectionvectorprofiles.json');
const selectionvector = require('../fixtures/selectionvector.json');

module.exports = [{
        id: "get-selectionvectorprofiles",
        url: "/api/selectionvector",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: profiles
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
    },
    {
        id: "get-selectionvector",
        url: "/api/project/:project/tailoring/:tailoring/selectionvector",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: selectionvector
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
    }
]