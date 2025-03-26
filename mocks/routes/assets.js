module.exports = [{
        id: "get-asset",
        url: "/assets/demo",
        method: "GET",
        variants: [{
            id: "static",
            type: "static",
            options: {
                path: "mocks/files/assets/demo"
            }
        }]
    },
    {
        id: "get-static",
        url: "/static/demo",
        method: "GET",
        variants: [{
            id: "static",
            type: "static",
            options: {
                path: "mocks/files/static/demo"
            }
        }]
    }
]