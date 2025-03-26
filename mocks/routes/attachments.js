const crypto = require('crypto');

const suffix = ["pdf", "xlsx", "zip", "json"];
const fileTypes = {
    pdf: {
        type: "application/pdf",
        file: "/mocks/files/screeningsheet.pdf"
    },
    xlsx: {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        file: "/mocks/files/PA,Safety_Sustainability-Katalog_8.2.1.xlsx"
    },
    zip: {
        type: "application/zip",
        file: "/mocks/files/DEMO-master.zip"
    },
    json: {
        type: "application/json",
        file: "/mocks/files/catalog_v8.2.1.json"
    }
};


let attachments = require('../fixtures/attachments.json');

module.exports = [{
        id: "get-attachments",
        url: "/api/project/:project/tailoring/:tailoring/attachment",
        method: "GET",
        variants: [{
                id: "middleware",
                type: "json",
                options: {
                    status: 200,
                    body: attachments
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
        id: "post-attachment",
        url: "/api/project/:project/tailoring/:tailoring/attachment",
        method: "POST",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {

                        const type = suffix[Math.floor(Math.random() * 3)];
                        const fileName = "mockedUpload_" + (Math.random() + 1).toString(36).substring(7) + "." + type;
                        const hash = crypto.createHash('sha256').update(fileName).digest("hex");
                        attachments._embedded.files.push({
                            "name": fileName,
                            "type": type,
                            "hash": hash,
                            "_links": {
                                "self": {
                                    "href": "/api/project/" + request.params.project + "/tailoring/" + request.params.tailoring + "/attachment/" + fileName
                                }
                            }
                        });
                        response.status(200);
                        response.send(attachments);
                    }
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
        id: "get-attachment",
        url: "/api/project/:project/tailoring/:tailoring/attachment/:filename",
        method: "GET",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const filename = request.params.filename;
                        const index = filename.lastIndexOf('.');
                        const suffix = filename.substring(index + 1);

                        response.set('content-disposition', 'form-data; name=\"attachment\"; filename=\"' + filename + '\"');
                        response.set('Content-Type', fileTypes[suffix].type)

                        response.status(200)
                        response.sendFile(process.cwd() + fileTypes[suffix].file)
                    }
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
        id: "delete-attachment",
        url: "/api/project/:project/tailoring/:tailoring/attachment/:filename",
        method: "DELETE",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const filename = request.params.filename;

                        const index = attachments._embedded.files.findIndex((item, i) => item.name === filename);
                        attachments._embedded.files.splice(index, 1);

                        response.status(200);
                        response.send(attachments);
                    }
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