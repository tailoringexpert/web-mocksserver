const catalogs = require('../fixtures/basecatalogs.json');

module.exports = [{
        id: "get-basecatalogs",
        url: "/api/catalog",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: catalogs
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
        id: "get-basecatalog-zip",
        url: "/api/catalog/:version/document",
        method: "GET",
        variants: [{
                id: "file",
                type: "file",
                options: {
                    status: 200,
                    headers: {
                        "content-disposition": "form-data; name=\"attachment\"; filename=\"catalog_8.2.1.zip\""
                    },
                    path: "mocks/files/catalog_8.2.1.zip"
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
        id: "get-basecatalog-pdf",
        url: "/api/catalog/:version/pdf",
        method: "GET",
        variants: [{
                id: "file",
                type: "file",
                options: {
                    status: 200,
                    headers: {
                        "content-disposition": "form-data; name=\"attachment\"; filename=\"PA,Safety & Sustainability-Katalog_8.2.1.pdf\""
                    },
                    path: "mocks/files/PA,Safety_Sustainability-Katalog_8.2.1.pdf"
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
        id: "get-basecatalog-json",
        url: "/api/catalog/:version/json",
        method: "GET",
        variants: [{
                id: "file",
                type: "file",
                options: {
                    status: 200,
                    headers: {
                        "content-disposition": "form-data; name=\"attachment\"; filename=\"catalog_v8.2.1.json\""
                    },
                    path: "mocks/files/catalog_v8.2.1.json"
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
        id: "get-basecatalog-excel",
        url: "/api/catalog/:version/excel",
        method: "GET",
        variants: [{
                id: "file",
                type: "file",
                options: {
                    status: 200,
                    headers: {
                        "content-disposition": "form-data; name=\"attachment\"; filename=\"PA,Safety & Sustainability-Katalog_8.2.1.xlsx\""
                    },
                    path: "mocks/files/PA,Safety_Sustainability-Katalog_8.2.1.xlsx"
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