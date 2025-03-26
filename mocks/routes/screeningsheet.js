const project = require('../fixtures/screeningsheet_project.json');
const tailoring = require('../fixtures/screeningsheet_tailoring.json');

module.exports = [{
        id: "post-screeningsheet",
        url: "/api/screeningsheet",
        method: "POST",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: project
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
        id: "get-screeningsheet-project",
        url: "/api/project/:project/screeningsheet",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: project
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
        id: "get-screeningsheet-project-pdf",
        url: "/api/project/:project/screeningsheet/pdf",
        method: "GET",
        variants: [{
                id: "file",
                type: "file",
                options: {
                    status: 200,
                    headers: {
                        "content-disposition": "form-data; name=\"attachment\"; filename=\"screeningsheet.pdf\""
                    },
                    path: "mocks/files/screeningsheet.pdf"
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
        id: "get-screeningsheet-tailoring",
        url: "/api/project/:project/tailoring/:tailoring/screeningsheet",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: tailoring
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
        id: "get-screeningsheet-tailoring-pdf",
        url: "/api/project/:project/tailoring/:tailoring/screeningsheet/pdf",
        method: "GET",
        variants: [{
                id: "file",
                type: "file",
                options: {
                    status: 200,
                    headers: {
                        "content-disposition": "form-data; name=\"attachment\"; filename=\"screeningsheet.pdf\""
                    },
                    path: "mocks/files/screeningsheet.pdf"
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